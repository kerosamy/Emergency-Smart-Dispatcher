import aiohttp
import asyncio

async def send_move(session, url, vehicle_id, lat, lng, idx):
    payload = {
        "id": vehicle_id,
        "latitude": lat,
        "longitude": lng
    }

    try:
        async with session.post(url, json=payload) as resp:
            if resp.status == 200:
                print(f"🚗 Vehicle {vehicle_id} moved to point {idx}")
            else:
                print(f"❌ Move failed: {resp.status}")
    except Exception as e:
        print(f"❌ API error: {e}")


async def walk_route(vehicle_id, coordinates):
    """
    Simulate vehicle movement:
    - Move to incident
    - Reverse path
    - Return to station
    """

    url = "http://localhost:8080/vehicles/move"

    async with aiohttp.ClientSession() as session:

        # 🚗 Go to incident
        print("➡️ Moving to incident...")
        for idx, (lng, lat) in enumerate(coordinates):
            await send_move(session, url, vehicle_id, lat, lng, idx)
            await asyncio.sleep(0.0005)

        # 🔄 Reverse path
        reversed_path = list(reversed(coordinates))

        # 🏠 Return to station
        print("⬅️ Returning to station...")
        for idx, (lng, lat) in enumerate(reversed_path):
            await send_move(session, url, vehicle_id, lat, lng, idx)
            await asyncio.sleep(0.0005)

        print("🏁 Vehicle arrived back at station")
