from typing import List
# from fastembed import TextEmbedding

class EmbeddingEngine:
    """
    Boilerplate module to handle chunking and FastEmbed execution.
    """
    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        self.model_name = model_name
        # self.embedding_model = TextEmbedding(model_name=self.model_name)
        print(f"Initialized EmbeddingEngine with model: {self.model_name}")

    def chunk_text(self, text: str, chunk_size: int = 500) -> List[str]:
        """
        A basic naive word chunker. In the future this can be swapped 
        with LangChain's RecursiveCharacterTextSplitter.
        """
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i+chunk_size])
            chunks.append(chunk)
        return chunks

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        print(f"Generating FastEmbed vectors for {len(texts)} chunks...")
        embeddings = list(self.embedding_model.embed(texts))
        return [emb.tolist() for emb in embeddings]
