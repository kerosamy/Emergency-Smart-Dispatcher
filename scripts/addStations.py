import requests
import random

URL = "http://localhost:8080/stations/add"   # change if needed
HEADERS = {
    "Content-Type": "application/json"
}

STATION_TYPES = ["FIRE", "MEDICAL", "POLICE"]
minX = 22.0
maxX = 31.7
minY = 25.0
maxY = 35.9

for i in range(1, 10):
    station_data = {
        "name": f"Station-{i}",
        "latitude": round(random.uniform(minX, maxX), 10),
        "longitude": round(random.uniform(minY, maxY), 10),
        "type": random.choice(STATION_TYPES)
    }

    response = requests.post(URL, json=station_data, headers=HEADERS)

    if response.status_code in (200, 201):
        print(f"✅ Station {i} created")
    else:
        print(f"❌ Failed Station {i} → {response.status_code}, {response.text}")
