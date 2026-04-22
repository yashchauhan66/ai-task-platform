import redis
import json
import os
import re
import signal
import sys
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
MONGO_URI = os.getenv('MONGO_URI')

try:
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    client = MongoClient(MONGO_URI)
    db = client.get_default_database() or client["test"]
    tasks = db["tasks"]
    print(f"Connected to Redis at {REDIS_HOST} and MongoDB")
except Exception as e:
    print(f"Initialization Error: {e}")
    sys.exit(1)

running = True

def handle_shutdown(signum, frame):
    global running
    print("\nShutdown signal received. Closing worker...")
    running = False

signal.signal(signal.SIGINT, handle_shutdown)
signal.signal(signal.SIGTERM, handle_shutdown)

print("Worker started. Waiting for tasks...")

while running:
    try:
        job = r.blpop("task_queue", timeout=5)

        if job:
            data = json.loads(job[1])
            task_id = data.get("taskId")
            input_text = str(data.get("input", ""))
            operation = data.get("operation")

            if not task_id:
                continue

            print(f"Processing task: {task_id}, operation: {operation}")

            tasks.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": {"status": "running"}}
            )

            result = ""
            if operation == "uppercase":
                result = input_text.upper()
            elif operation == "lowercase":
                result = input_text.lower()
            elif operation == "reverse":
                result = input_text[::-1]
            elif operation == "wordcount":
                words = re.findall(r'\w+', input_text)
                result = str(len(words))
            else:
                raise Exception(f"Invalid operation: {operation}")

            tasks.update_one(
                {"_id": ObjectId(task_id)},
                {"$set": {
                    "status": "success",
                    "result": result,
                    "logs": "Completed successfully"
                }}
            )
            print(f"Task {task_id} completed successfully.")

    except redis.ConnectionError:
        print("Redis connection lost. Retrying in 5 seconds...")
        import time
        time.sleep(5)
    except Exception as e:
        print("Error processing task:", str(e))
        current_task_id = locals().get('task_id')
        if current_task_id:
             tasks.update_one(
                {"_id": ObjectId(current_task_id)},
                {"$set": {"status": "failed", "logs": str(e)}}
            )

print("Worker exited gracefully.")
