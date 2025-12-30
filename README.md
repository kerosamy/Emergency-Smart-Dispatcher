# Emergency Smart Dispatcher - Recent Changes

## Overview
During This milestone, the current changes was added to the the Emergency Dispatching Project:
- Data Analytics Showing the the top 10 performing units {vehicles & stations}.
- A websocket for notifications and live changes on both map and system
- The movement receptor for handling the rendering of the route and the IoT simulation of the vehicles' tracking
- Some additional Statistics charts to show average response time based on hour and day

---

## Recent Major Features & Improvements

### 1. **Reports and Analytics System**
- **Reports and Analytics**
  - Comprehensive statistics endpoints for emergency response analysis and to fetch the minimum, maximum & average overall response time.
  - Similar Endpoints to fetch the minimum, maximum & average overall response time.
  - Added multiple chart visualizations for the hourly distribution of response time and the daily representation of response time.
  - Extending the queries with multiple filters to fetch the data based on the year, month, full date or for different types

### 2. **Enhanced PDF Report Generation**
- **Assignment Time Tracking**
  - Integrated assignment time metrics into PDF reports
  - Added assignment time statistics to frontend views
- **PDF Export Feature**
  - Implemented option to download reports as PDF
  - Integrated with statistics dashboard

### 3. **WebSocket Integration**
- **Real-Time Communication**
  - Implemented WebSocket configuration
  - Enabled real-time updates for incident tracking and visualizing on the map
  - Updating notifications to handle live changes and cross-sessions immediate updates
  - Added a Spring configuration class to enable WebSocket message broker.
  - Configured:
    - Broker destinations: /topic for broadcasting messages.
    - Application destination prefix: /app for client‑to‑server messages.
    - STOMP endpoint: /ws for WebSocket connections.
    - Allowed all origins (*) for development flexibility


### 5. **Automatic Vehicle Assignment**
- **Smart Assignment Logic**
  - Implemented auto-assignment system for vehicles to incidents
  - Added race condition handling with locks
  - Automatic dispatch of nearest available vehicles
  - Added Triggering functions as :
    - ```handleNewIncident()``` - Triggered & sending notification when a new incident is reported
    - ```handleNewVehicle()``` - Triggered & send notification when a vehicle becomes available.
    - ```assignVehicleToIncident()``` Performs the actual assignment when the lock is available.

### 9. **Routing & Map Integration**
- **Route Planning**
  - Added connection between route display and API endpoints
  - Integrated map-based route visualization
- **Vehicle Position Tracking**
  - Implemented arrival confirmation functionality
  - Added incident resolution status tracking
  - Improved vehicle position updates
  


---

## Technical Highlights

### Backend Improvements
- Enhanced statistics endpoints for comprehensive analytics
- Improved database query performance with indexes
- Race condition handling in auto-assignment logic
- WebSocket support for real-time updates
- Better data validation and integrity checks

### Frontend Improvements
- New chart components for data visualization (Recharts integration)
- Responsive reports dashboard
- PDF export functionality
- Real-time status updates via WebSocket
- Improved color scheme and UI/UX design
- Time series data visualization

---

## Key Files Modified

### Backend (Java/Spring Boot)
- `IncidentService.java` - Statistics and assignment logic
- `ReportService.java` - Report generation endpoints
- `VehicleService.java` - Auto-assignment implementation
- `SolvedByMapper.java` - Data mapping fixes
- Database configuration and indices

### Frontend (React/Vite)
- `Reports.jsx` - Main reports dashboard page
- `HourlyDistributionChart.jsx` - Hourly analytics visualization
- `TimeSeriesChart.jsx` - Daily trend analysis
- `MultiTypeTimeSeriesChart.jsx` - Multi-type comparison
- `ReportService.js` - Frontend API integration

---
