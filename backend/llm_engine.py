import os
from typing import List, Dict, Any
import json
import logging


try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

logger = logging.getLogger("civic_spiegel.llm")

class LLMEngine:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.mock_mode = not self.api_key or not GROQ_AVAILABLE
        
        if self.mock_mode:
            print("LLMEngine initialized in MOCK MODE. No Groq API key found.")
        else:
            self.client = Groq(api_key=self.api_key)
            print("LLMEngine initialized with Groq API.")

    def generate_response(self, query: str, demographics: Dict[str, str], context_chunks: List[Dict]) -> Dict[str, Any]:
        """
        Takes the user query, their demographics, and the RAG chunks,
        then queries the LLM for a personalized response.
        """
        logger.info(
            "LLM generate_response start query='%s' context_chunks=%s",
            query.strip(),
            len(context_chunks),
        )

        # Format the context text
        if not context_chunks:
            context_text = (
                "No directly relevant policy documents were retrieved. "
                "Use the user's query and demographics to provide cautious, partial guidance."
            )
        else:
            formatted_chunks: List[str] = []
            for idx, chunk in enumerate(context_chunks, start=1):
                title = (chunk.get("title") or "Unknown source").strip()
                source_type = (chunk.get("source_type") or "Unknown source type").strip()
                published_date = chunk.get("published_date") or "Unknown publication date"
                text_content = (chunk.get("text_content") or "").strip()
                if len(text_content) > 1200:
                    text_content = f"{text_content[:1200]}..."
                formatted_chunks.append(
                    f"[Context {idx}]\n"
                    f"Title: {title}\n"
                    f"Source Type: {source_type}\n"
                    f"Published Date: {published_date}\n"
                    f"Key Text: {text_content}"
                )
            context_text = "\n\n".join(formatted_chunks)
            logger.info(
                "LLM context prepared blocks=%s sample_titles=%s",
                len(formatted_chunks),
                [c.get("title", "Unknown") for c in context_chunks[:3]],
            )
        
        # Format demographics
        demo_text = "\n".join([f"- {k}: {v}" for k, v in demographics.items() if v])
        
        system_prompt = (
            "You are Civic Spiegel, an unbiased civic policy assistant.\n\n"
            f"User Demographics:\n{demo_text}\n\n"
            f"Context Documents (cleaned retrieval snippets):\n{context_text}\n\n"
            "Your job is to generate a structured civic policy briefing.\n\n"

            "CRITICAL OUTPUT RULE:\n"
            "Return ONLY valid JSON. No extra text.\n\n"

            "JSON FORMAT:\n"
            "{\n"
            '"at_a_glance": ["bullet", "bullet"],\n'
            '"key_takeaways": ["bullet", "bullet"],\n'
            '"what_this_means": ["bullet", "bullet"],\n'
            '"relevant_actions": ["bullet", "bullet"],\n'
            '"sources": [\n'
            '{ "title": "...", "description": "..." }\n'
            "]\n"
            "}\n\n"

            "STRICT RULES:\n"
            "- Never include context labels like 'Context 1', 'Context 2', or similar identifiers\n"
            "- Never copy retrieval metadata or numbering\n"
            "- Ignore duplicate or irrelevant context items\n"
            "- Do NOT output 'Not enough information' unless ALL sections truly have zero usable facts\n"
            "- If partial info exists, ALWAYS produce a best-effort answer\n"
            "- Every bullet must contain at least one concrete fact (policy name, number, program, agency)\n"
            "- Do NOT use generic phrasing (e.g., 'may affect', 'could impact')\n"
            "- Do NOT repeat the same idea across sections\n"
            "- Each section must contain distinct information\n\n"

            "SECTION DEFINITIONS:\n"
            "- at_a_glance (Policy overview): factual signals (numbers, programs, policies)\n"
            "- key_takeaways: interpretation of policies and patterns\n"
            "- what_this_means: implications for the user based on demographics\n"
            "- relevant_actions: concrete steps, programs, or agencies\n\n"

            "SOURCE RULES:\n"
            "- Use only cleaned entity-style source names (no 'Context #' labels)\n"
            "- Each source must be a real document or dataset name from context\n"
            "- Each description must clearly state what information it contributed\n\n"

            "CONTEXT HANDLING:\n"
            "- Treat context as unstructured notes that must be synthesized\n"
            "- Never reference raw formatting from context\n"
            "- Merge duplicates before reasoning\n"
        )

        if self.mock_mode:
            return {
                "at_a_glance": ["Mock mode active", "Groq API key missing or Groq package unavailable"],
                "key_takeaways": ["Live model response unavailable", "Set GROQ_API_KEY to enable structured live output"],
                "what_this_means": ["Not enough information"],
                "relevant_actions": ["Add GROQ_API_KEY in backend/.env", "Restart backend server"],
                "sources": [],
            }
        
        # Real Groq call
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                model="llama-3.1-8b-instant",
                temperature=0.3,
            )
            response_text = chat_completion.choices[0].message.content
            logger.info("LLM raw response length=%s", len(response_text or ""))
            try:
                return json.loads(response_text)
            except Exception:
                return {
                    "error": "Invalid JSON from LLM",
                    "raw": response_text,
                }
        except Exception as e:
            return {
                "error": f"Error connecting to LLM: {str(e)}",
                "raw": "",
            }
        # python -m uvicorn main:app --reload