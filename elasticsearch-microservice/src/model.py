from sentence_transformers import SentenceTransformer

"""
https://huggingface.co/spaces/mteb/leaderboard

Why this model is a good choice?

1) It has a 100% zero-shot value, which means it doesn't need to be trained for specific tasks
2) It doesn't use a lot of memory
3) It doesn't have a lot of parameteres, which means it processes the input quite fast

"""

model = SentenceTransformer("intfloat/e5-base-v2")

def embed(text: str, is_query: bool = True) -> list[float]:
    """
    Returns an embedding for a query or a document.
      - text: the content to embed
      - is_query: True for a query, False for a document
    """
    prefix = "query: " if is_query else "passage: "
    vec = model.encode([prefix + text], normalize_embeddings=True)
    return vec[0].tolist()