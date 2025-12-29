import requests
import random

URL = "http://localhost:8080/vehicles/add"   # change if needed
HEADERS = {
    "Content-Type": "application/json"
}



for i in range(1, 101):
    index = random.randint(1, 100)

    vehicle_data = {
        "capacity": random.randint(1, 10),
        "vehicleStatus": "AVAILABLE",
        "stationName": f"Station-{index}",
        "responderEmail": f"user{i}@example.com"
    }

    response = requests.post(URL, json=vehicle_data, headers=HEADERS)

    if response.status_code in (200, 201):
        print(f"✅ Vehicle {i} created")
    else:
        print(f"❌ Failed Vehicle {i} → {response.status_code}, {response.text}")
