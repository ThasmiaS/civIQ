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
            f"Context Documents:\n{context_text}\n\n"
            "Your job is to generate a structured policy briefing.\n\n"
            "Return ONLY valid JSON in this format:\n\n"
            "{\n"
            '"at_a_glance": ["bullet", "bullet"],\n'
            '"key_takeaways": ["bullet", "bullet"],\n'
            '"what_this_means": ["bullet", "bullet"],\n'
            '"relevant_actions": ["bullet", "bullet"],\n'
            '"sources": [\n'
            "{\n"
            '"title": "Readable source name",\n'
            '"description": "1 sentence explaining relevance"\n'
            "}\n"
            "]\n"
            "}\n\n"
            "STRICT RULES:\n"
            "* Do NOT return anything except JSON\n"
            "* Use a mix of concise bullets and short paragraph-style items when needed for clarity\n"
            "* Each item can be up to 80 words when detail is needed\n"
            "* Every item must include at least one concrete detail when available: number, policy name, demographic statistic, or program name\n"
            "* Every item must explicitly reference retrieved context details, not generic claims\n"
            "* Do NOT repeat information across sections\n"
            "* Each section must contain DIFFERENT content\n"
            "* Do NOT say 'based on the provided context'\n"
            "* Do NOT use symbols like *, +, or mixed formatting inside item text\n"
            '* Use "Not enough information" only when a section cannot be supported by any retrieved detail or reasonable cautious inference\n'
            '* If context is weak, include one bullet: "Limited context available; estimates based on provided documents."\n'
            '* Do NOT use generic statements like "rent is expensive", "people are impacted", or "may affect affordability"\n'
            "* If no sources exist, return an empty array []\n\n"
            "SECTION DEFINITIONS:\n"
            "* at_a_glance: factual, high-signal numbers and core facts only (primarily bullets)\n"
            "* key_takeaways: policy interpretation, patterns, and trends from the retrieved context (allow short explanatory paragraph-style items)\n"
            "* what_this_means: personalized reasoning using demographics plus retrieved context (allow short explanatory paragraph-style items)\n"
            "* relevant_actions: specific actionable steps using concrete programs, agencies, or behaviors (action-oriented bullets)\n\n"
            "PARTIAL CONTEXT GUIDANCE:\n"
            "* If context is partial, still provide useful items grounded in available retrieved facts plus cautious implications\n"
            "* Never fill all sections with 'Not enough information' when at least one concrete detail exists\n\n"
            "SOURCES RULES:\n"
            "* Each source title must use the full entity name\n"
            "* Each source description must state exactly what data it contributes\n"
            "* Example: 'NYC Rent Guidelines Board 2022 Report – rent increase percentages and housing trends'\n"
            "* Do NOT use generic source descriptions like 'report' or 'article'."
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