from addResponders import *
from addStations import *
from addVehicles import *
from addIncident import *
from helper import *

def main(n):
    print(f"=== Creating {n} users (responders) ===")
    create_users(n)

    print(f"\n=== Creating {n} stations ===")
    create_stations(n, minX, maxX, minY, maxY)

    print(f"\n=== Creating {n} vehicles ===")
    create_vehicles(n, station_count=n)  # Assign vehicles to created stations

    print(f"\n=== Reporting {n} incidents ===")
    report_incidents(n)

if __name__ == "__main__":
    n = 100  # Change this to any number of responders/stations/vehicles/incidents
    main(n)
