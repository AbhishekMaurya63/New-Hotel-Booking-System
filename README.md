<<<<<<< HEAD
# Hotel Booking Management System

This Hotel Booking Management System is a web application designed to help hotel staff manage bookings, rooms, guests, and revenue effectively. Built using Flask for the backend, it connects to a SQLite database to store and retrieve data, and uses HTML, CSS, JavaScript, and Bootstrap for the frontend interface.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Database Structure](#database-structure)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [License](#license)

## Features
- **Room Management**: Add, view, and manage rooms.
- **Guest Management**: Track guest details and reservations.
- **Booking Management**: Create and view bookings with check-in and check-out dates.
- **Revenue Tracking**: View total revenue and filter revenue within specific date ranges.
- **User Authentication**: Secure login for hotel staff.

## Technologies Used
- **Backend**: Python, Flask, SQLite
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Database**: SQLite
- **Other**: Context Managers, Flask API Endpoints, AJAX (for fetching dashboard data)

## Setup and Installation
1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/hotel-booking-system.git
    cd hotel-booking-system
    ```

2. **Create a Virtual Environment** (Optional but recommended):
    ```bash
    python3 -m venv venv
    source venv/bin/activate   # On Windows: venv\Scripts\activate
    ```

3. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Database Setup**:
    - Run the database setup script to initialize the SQLite database.
    ```python
    python database.py
    ```

5. **Run the Application**:
    ```bash
    flask run
    ```

6. **Access the App**:
    - Open your browser and go to `http://127.0.0.1:5000`

## Database Structure

The database consists of four primary tables:

- `rooms`: Stores room details including type, price, and availability.
- `guests`: Stores guest details.
- `bookings`: Stores booking information such as guest ID, room ID, and check-in/check-out dates.
- `empregister`: Stores employee details for login/authentication.

The database schema can be found in the `database.py` file, which also includes a context manager for managing connections.

## Usage
1. **Dashboard**: The dashboard displays counts for total rooms, total guests, occupied rooms, and total revenue.
2. **Room Management**: View and manage available rooms.
3. **Booking Management**: Create and view guest bookings.
4. **Revenue Tracking**: Check the total revenue or filter by date range using the "Total Revenue" page.

### Note:
Ensure you have some sample data added to the `rooms`, `guests`, and `bookings` tables to see the data reflected on the dashboard.

## Endpoints

| Endpoint           | Method | Description                         |
|--------------------|--------|-------------------------------------|
| `/index`           | GET    | Dashboard page                     |
| `/rooms`           | GET    | Rooms page                         |
| `/guests`          | GET    | Guests page                        |
| `/bookings`        | GET    | Bookings page                      |
| `/dashboard_data`  | GET    | API endpoint for dashboard counts  |
| `/total_revenue`   | GET    | API endpoint for revenue data      |

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any feature requests, bug fixes, or enhancements.

---

> **Note**: This project is intended for hotel management staff and not customers directly. It includes secure login functionality for employees and ensures data accuracy for hotel room bookings and revenue.
=======
# New-Hotel-Booking-System
>>>>>>> b5922b1d87cc9a882037c6477656b5a4ffb24eb4
