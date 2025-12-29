import requests
import random

URL = "http://localhost:8080/stations/add"   # change if needed
HEADERS = {
    "Content-Type": "application/json"
}

STATION_TYPES = ["FIRE", "MEDICAL", "POLICE"]

for i in range(1, 101):
    station_data = {
        "name": f"Station-{i}",
        "latitude": round(random.uniform(22.0, 31.7), 10),
        "longitude": round(random.uniform(25.0, 35.9), 10),
        "type": random.choice(STATION_TYPES)
    }

    response = requests.post(URL, json=station_data, headers=HEADERS)

    if response.status_code in (200, 201):
        print(f"✅ Station {i} created")
    else:
        print(f"❌ Failed Station {i} → {response.status_code}, {response.text}")
