FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


COPY worker.py .


ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV MONGO_URI=""


CMD [ "python", "-u", "worker.py" ]
