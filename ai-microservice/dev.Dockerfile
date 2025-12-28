FROM adam523/es-microservice-prebuilt:0.1.0

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ src/

EXPOSE 50057

SHELL ["/bin/bash", "-c"]
CMD python3 src/dev_runner.py || python src/dev_runner.py