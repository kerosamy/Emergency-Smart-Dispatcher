import aiohttp
import asyncio

async def call_patch(session, url, params=None):
    """
    Helper to call PATCH endpoint with query params.
    """
    try:
        async with session.patch(url, params=params) as resp:
            if resp.status == 200:
                print(f"✅ PATCH {url} succeeded with params {params}")
            else:
                print(f"❌ PATCH {url} failed: {resp.status}")
    except Exception as e:
        print(f"❌ PATCH API error: {e}")


async def walk_route(vehicle_id, incident_id, coordinates):
    """
    Simulate vehicle movement:
    - Move to incident
    - Call arrival API
    - Wait 3s and call resolve API
    - Reverse path and return to station
    """

    move_url = "http://localhost:8080/vehicles/move"
    arrival_url = f"http://localhost:8080/incidents/{incident_id}/arrival"
    resolve_url = f"http://localhost:8080/incidents/{incident_id}/resolve"
    available_url = f"http://localhost:8080/vehicles/{vehicle_id}/available"

    async with aiohttp.ClientSession() as session:

        # 🚗 Go to incident
        print("➡️ Moving to incident...")
        for idx, (lng, lat) in enumerate(coordinates):
            payload = {"id": vehicle_id, "latitude": lat, "longitude": lng}
            try:
                async with session.post(move_url, json=payload) as resp:
                    if resp.status == 200:
                        print(f"🚗 Vehicle {vehicle_id} moved to point {idx}")
                    else:
                        print(f"❌ Move failed: {resp.status}")
            except Exception as e:
                print(f"❌ Move API error: {e}")


        # 🏁 Vehicle arrived at incident
        print(f"🏁 Vehicle {vehicle_id} arrived at incident {incident_id}")

        # ⏱ Wait 0.5s then call arrival
        await asyncio.sleep(0.5)
        await call_patch(session, arrival_url, {"vehicleId": vehicle_id})

        # ⏱ Wait 3s then call resolve
        await asyncio.sleep(3)
        await call_patch(session, resolve_url, {"vehicleId": vehicle_id})

        # 🔄 Reverse path to return
        reversed_path = list(reversed(coordinates))
        print("⬅️ Returning to station...")
        for idx, (lng, lat) in enumerate(reversed_path):
            payload = {"id": vehicle_id, "latitude": lat, "longitude": lng}
            try:
                async with session.post(move_url, json=payload) as resp:
                    if resp.status == 200:
                        print(f"🚗 Vehicle {vehicle_id} moved back to point {idx}")
                    else:
                        print(f"❌ Move failed: {resp.status}")
            except Exception as e:
                print(f"❌ Move API error: {e}")

            await asyncio.sleep(0.0005)

        print(f"🏁 Vehicle {vehicle_id} returned to station")

        await asyncio.sleep(2)
        await call_patch(session, available_url)
        print(f"✅ Vehicle {vehicle_id} is now AVAILABLE")
        
