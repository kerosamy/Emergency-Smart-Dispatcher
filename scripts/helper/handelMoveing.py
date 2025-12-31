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

async def walk_route(vehicle_id, incident_id, coordinates, vehicle_type, step=10):
    """
    Move vehicle to incident, but skip intermediate points.
    - step: send update every `step` points
    """

    move_url = "http://localhost:8080/vehicles/move"
    arrival_url = f"http://localhost:8080/incidents/{incident_id}/arrival"
    resolve_url = f"http://localhost:8080/incidents/{incident_id}/resolve"
    available_url = f"http://localhost:8080/vehicles/{vehicle_id}/available"

    async with aiohttp.ClientSession() as session:

        # 🚗 Go to incident (jumping)
        print("➡️ Moving to incident...")
        await asyncio.sleep(0.5)
        for idx in range(0, len(coordinates), step):
            lng, lat = coordinates[idx]
            payload = {"id": vehicle_id, "latitude": lat, "longitude": lng, "type": vehicle_type}
            try:
                async with session.post(move_url, json=payload) as resp:
                    if resp.status == 200:
                        print(f"🚗 Vehicle {vehicle_id} moved to point {idx}")
                    else:
                        print(f"❌ Move failed: {resp.status}")
            except Exception as e:
                print(f"❌ Move API error: {e}")

        # Ensure last point is always sent
        if coordinates[-1] != coordinates[idx]:
            lng, lat = coordinates[-1]
            payload = {"id": vehicle_id, "latitude": lat, "longitude": lng, "type": vehicle_type}
            async with session.post(move_url, json=payload) as resp:
                if resp.status == 200:
                    print(f"🚗 Vehicle {vehicle_id} moved to final point")
                else:
                    print(f"❌ Move failed at final point: {resp.status}")

        # 🏁 Vehicle arrived at incident
        print(f"🏁 Vehicle {vehicle_id} arrived at incident {incident_id}")

        # ⏱ Wait 0.5s then call arrival
        await asyncio.sleep(0.5)
        await call_patch(session, arrival_url, {"vehicleId": vehicle_id})

        # ⏱ Wait 3s then call resolve
        await asyncio.sleep(3)
        await call_patch(session, resolve_url, {"vehicleId": vehicle_id})

        # 🔄 Reverse path to return
        print("⬅️ Returning to station...")
        for idx in range(len(coordinates)-1, -1, -step):
            lng, lat = coordinates[idx]
            payload = {"id": vehicle_id, "latitude": lat, "longitude": lng}
            try:
                async with session.post(move_url, json=payload) as resp:
                    if resp.status == 200:
                        print(f"🚗 Vehicle {vehicle_id} moved back to point {idx}")
                    else:
                        print(f"❌ Move failed: {resp.status}")
            except Exception as e:
                print(f"❌ Move API error: {e}")

        # Ensure first point is always sent
        if coordinates[0] != coordinates[idx]:
            lng, lat = coordinates[0]
            payload = {"id": vehicle_id, "latitude": lat, "longitude": lng}
            async with session.post(move_url, json=payload) as resp:
                if resp.status == 200:
                    print(f"🚗 Vehicle {vehicle_id} returned to station")
                else:
                    print(f"❌ Move failed at return start: {resp.status}")

        await asyncio.sleep(2)
        await call_patch(session, available_url)
        print(f"✅ Vehicle {vehicle_id} is now AVAILABLE")
