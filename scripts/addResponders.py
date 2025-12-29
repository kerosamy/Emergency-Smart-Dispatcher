import requests
from helper import * 

def create_users(n):
    URL = "http://localhost:8080/users/add-user"
    HEADERS = {
        "Content-Type": "application/json"
    }

    for i in range(1, n + 1):
        user_data = {
            "name": f"User{i}",
            "email": f"user{i}@example.com",
            "password": "password123",
            "role": "RESPONDER"
        }

        response = requests.post(URL, json=user_data, headers=HEADERS)

        if response.status_code == 200:
            print(f"✅ User {i} created")
        else:
            print(f"❌ Failed to create User {i} → {response.status_code}, {response.text}")


