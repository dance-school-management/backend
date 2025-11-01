FROM python:3.10-slim

RUN pip install --no-cache-dir \
    torch==2.8.0 \
    sentence-transformers==5.1.1 \
    transformers==4.56.2 \
    tokenizers==0.22.1 \
    triton==3.4.0 \
    --extra-index-url https://download.pytorch.org/whl/cpu
