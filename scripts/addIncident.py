import random
import requests

API_URL = "http://localhost:8080/incidents"  # change if needed

# Egypt bounding box
MIN_LAT, MAX_LAT = 22.0, 31.7
MIN_LON, MAX_LON = 25.0, 35.9

incident_types = ["FIRE", "CRIME","MEDICAL"]

def generate_incident():
    return {
        "type": random.choice(incident_types),
        "severity": random.randint(1, 5),
        "latitude": round(random.uniform(MIN_LAT, MAX_LAT), 6),
        "longitude": round(random.uniform(MIN_LON, MAX_LON), 6),
        "status": "REPORTED",
        "capacity": 5
    }

def report_incident(incident):
    response = requests.post(API_URL, json=incident)
    if response.status_code == 201:
        print(f"Reported incident: {incident}")
    else:
        print(f"Failed to report: {incident}, Status: {response.status_code}, Response: {response.text}")

def main():
    for _ in range(100):
        incident = generate_incident()
        report_incident(incident)

if __name__ == "__main__":
    main()
