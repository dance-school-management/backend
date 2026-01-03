FROM adam523/es-microservice-prebuilt:0.1.0

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ .

EXPOSE 8007

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8007", "--reload", "--reload-dir", "/usr/src/app"]