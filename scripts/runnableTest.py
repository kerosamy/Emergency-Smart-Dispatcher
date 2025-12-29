import redis
import time

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

vehicle_id = 1
lat = 31.2001
lng = 29.9187

key = f"id:{vehicle_id}"

while True:
    lat += 0.1
    lng += 0.1

    value = f"{lat},{lng}"
    r.set(key, value)

    print(f"Updated {key} -> {value}")
    time.sleep(1)
