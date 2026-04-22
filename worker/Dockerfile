FROM python:3.12-slim


WORKDIR /app


COPY requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt


COPY worker.py .


RUN useradd -m appuser


USER appuser


ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV MONGO_URI=${MONGO_URI}


CMD ["python", "-u", "worker.py"]