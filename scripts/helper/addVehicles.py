import requests
import random

def create_vehicles(n, station_count):
    """
    Create `n` vehicles and assign them randomly to stations.

    :param n: Number of vehicles to create
    :param station_count: Number of existing stations to pick from
    """
    URL = "http://localhost:8080/vehicles/add"  # change if needed
    HEADERS = {
        "Content-Type": "application/json"
    }

    for i in range(1, n + 1):
        index = random.randint(1, station_count)

        vehicle_data = {
            "capacity": random.randint(5, 10),
            "vehicleStatus": "AVAILABLE",
            "stationName": f"Station-{index}",
            "responderEmail": f"user{i}@example.com"
        }

        response = requests.post(URL, json=vehicle_data, headers=HEADERS)

        if response.status_code in (200, 201):
            print(f"✅ Vehicle {i} created")
        else:
            print(f"❌ Failed Vehicle {i} → {response.status_code}, {response.text}")

# Example usage:
# create_vehicles(10, 9)  # 10 vehicles, stations are Station-1 to Station-9
