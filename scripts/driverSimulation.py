import asyncio
import json
import websockets
from helper.handelMoveing import *

class DriverSimulator:
    def __init__(self, driver_email):
        self.driver_email = driver_email
        self.ws = None
        self.running = True

    async def connect(self):
        """Connect to WebSocket server"""
        try:
            self.ws = await websockets.connect("ws://localhost:8080/ws")
            
            connect_frame = (
                f"CONNECT\n"
                f"driver-email:{self.driver_email}\n"
                f"accept-version:1.1,1.2\n"
                f"heart-beat:0,0\n"
                f"\n\x00"
            )
            await self.ws.send(connect_frame)
            
            # Wait for CONNECTED response
            response = await self.ws.recv()
            if "CONNECTED" in response:
                print(f"[{self.driver_email}] ✅ Connected")
                return True
            return False
        except Exception as e:
            print(f"[{self.driver_email}] ❌ Connection failed: {e}")
            return False

    async def subscribe(self):
        """Subscribe to driver's assignment queue"""
        subscribe_frame = (
            f"SUBSCRIBE\n"
            f"id:sub-{self.driver_email}\n"
            f"destination:/user/queue/assignments\n"
            f"ack:auto\n"
            f"\n\x00"
        )
        await self.ws.send(subscribe_frame)
        print(f"[{self.driver_email}] 📡 Subscribed to assignments")

    def parse_stomp_message(self, raw_message):
        """Parse STOMP MESSAGE frame"""
        try:
            if not raw_message.startswith("MESSAGE"):
                return None
            
            # Split headers and body
            parts = raw_message.split('\n\n', 1)
            if len(parts) < 2:
                return None
            
            # Extract body (remove null terminator)
            body = parts[1].rstrip('\x00')
            return json.loads(body)
            
        except Exception as e:
            print(f"[{self.driver_email}] Parse error: {e}")
            return None

    async def listen(self):
        """Listen for incoming assignments"""
        print(f"[{self.driver_email}] 👂 Listening for assignments...\n")
        
        try:
            while self.running:
                message = await self.ws.recv()
                
                if message:
                    # Handle heartbeat
                    if message.strip() == "\n":
                        continue
                    
                    assignment = self.parse_stomp_message(message)
                    if assignment:
                        await self.handle_assignment(assignment)
                        
        except websockets.exceptions.ConnectionClosed:
            print(f"[{self.driver_email}] 🔌 Connection closed")
        except Exception as e:
            print(f"[{self.driver_email}] ❌ Listen error: {e}")

    async def handle_assignment(self, assignment):
        print(f"\n🚨 Assignment received for {self.driver_email}")

        vehicle_id = assignment.get("vehicleId")

        route = assignment.get("route", {})
        routes = route.get("routes", [])

        if not routes:
            print("❌ No route found")
            return

        coordinates = routes[0]["geometry"]["coordinates"]

        print(f"🛣️ Route points: {len(coordinates)}")
        print("🚗 Starting movement...\n")

        await walk_route(vehicle_id, coordinates)

        print("✅ Vehicle reached destination")

    async def disconnect(self):
        """Disconnect from WebSocket"""
        self.running = False
        if self.ws:
            try:
                disconnect_frame = "DISCONNECT\n\n\x00"
                await self.ws.send(disconnect_frame)
                await self.ws.close()
                print(f"[{self.driver_email}] 🔌 Disconnected")
            except:
                pass

async def driver_task(driver_email):
    """Run a single driver simulation"""
    driver = DriverSimulator(driver_email)
    
    try:
        if await driver.connect():
            await driver.subscribe()
            await driver.listen()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"[{driver_email}] ❌ Error: {e}")
    finally:
        await driver.disconnect()

async def main(n):
    # Create n simulated drivers
    drivers = [f"user{i}@example.com" for i in range(1, n + 1)]
    
    print(f"Starting {len(drivers)} driver connections...")
    print("Press Ctrl+C to stop\n")
    
    tasks = [driver_task(email) for email in drivers]
    
    try:
        await asyncio.gather(*tasks)
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down simulation...")

if __name__ == "__main__":
    n = 10  # Number of simulated drivers
    asyncio.run(main(n))