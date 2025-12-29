import random
import requests
from helper import * 

API_URL = "http://localhost:8080/incidents"  # change if needed

incident_types = ["FIRE", "CRIME", "MEDICAL"]

def generate_incident():
    return {
        "type": random.choice(incident_types),
        "severity": random.randint(1, 5),
        "latitude": round(random.uniform(minX, maxX), 6),
        "longitude": round(random.uniform(minY, maxY), 6),
        "status": "REPORTED",
        "capacity": 5
    }

def report_incident(incident):
    response = requests.post(API_URL, json=incident)
    if response.status_code == 201:
        print(f"✅ Reported incident: {incident}")
    else:
        print(f"❌ Failed to report: {incident}, Status: {response.status_code}, Response: {response.text}")

def report_incidents(n):
    for _ in range(n):
        incident = generate_incident()
        report_incident(incident)

# Example usage:
# report_incidents(10)
