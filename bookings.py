from flask import Blueprint, jsonify, request # type: ignore
import sqlite3
from datetime import datetime
bookings_bp = Blueprint('bookings', __name__)
def get_db_connection():
    conn = sqlite3.connect('hotel_management.db')
    conn.row_factory = sqlite3.Row  # To access rows as dictionaries
    return conn

@bookings_bp.route('/bookings', methods=['POST'])
def add_bookings():
    conn = get_db_connection()
    guest_email = request.form.get('email')
    room_number = request.form.get('roomNumber')
    check_in_date = request.form.get('checkInDate')
    check_out_date = request.form.get('checkOutDate')

    # Check for missing fields
    if not room_number or not guest_email or not check_in_date or not check_out_date:
        return jsonify({"error": "All fields are required."}), 400

    try:
        # Check if guest email is registered
        guest_check = conn.execute('SELECT 1 FROM guests WHERE email = ?', (guest_email,)).fetchone()
        if not guest_check:
            return jsonify({"error": "Guest not registered."}), 400

        # Check if room number exists in rooms table
        room_check = conn.execute('SELECT 1 FROM rooms WHERE room_id = ?', (room_number,)).fetchone()
        if not room_check:
            return jsonify({"error": "Room number not registered."}), 400

        # Check if the room is available (i.e., not booked for requested dates)
        availability_check = conn.execute(
            '''
            SELECT 1 FROM bookings 
            WHERE room_id = ? 
            AND ((check_in_date <= ? AND check_out_date >= ?) OR 
                 (check_in_date <= ? AND check_out_date >= ?))
            ''', (room_number, check_out_date, check_in_date, check_in_date, check_out_date)
        ).fetchone()
        
        if availability_check:
            return jsonify({"error": "Room not available."}), 400

        # If all checks pass, proceed to book the room
        conn.execute(
            '''
            INSERT INTO bookings (guest_email, room_id, check_in_date, check_out_date) 
            VALUES (?, ?, ?, ?)
            ''', (guest_email, room_number, check_in_date, check_out_date)
        )
        conn.commit()

    except Exception as e:
        return jsonify({"error": "An error occurred: " + str(e)}), 500

    finally:
        conn.close()

    return jsonify({"success": "Room booked successfully"}), 200


@bookings_bp.route('/available_rooms', methods=['POST'])
def check_available_rooms():
    data = request.form
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')

    if not check_in_date or not check_out_date:
        return jsonify({"error": "Check-in and check-out dates are required."}), 400

    try:
        # Convert the dates to the correct format for the SQL query
        check_in_date_obj = datetime.strptime(check_in_date, '%Y-%m-%d')
        check_out_date_obj = datetime.strptime(check_out_date, '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # SQL query to find available rooms
    query = '''
    SELECT r.room_id, r.room_type, r.price, 
           CASE WHEN b.room_id IS NULL THEN 1 ELSE 0 END AS is_available
    FROM rooms r
    LEFT JOIN bookings b 
        ON r.room_id = b.room_id 
        AND (b.check_in_date BETWEEN ? AND ? 
             OR b.check_out_date BETWEEN ? AND ? 
             OR ? BETWEEN b.check_in_date AND b.check_out_date
             OR ? BETWEEN b.check_in_date AND b.check_out_date)
    WHERE b.room_id IS NULL OR b.check_in_date IS NULL;
    '''
    cursor.execute(query, (check_in_date_obj, check_out_date_obj, check_in_date_obj, check_out_date_obj, check_in_date_obj, check_out_date_obj))
    available_rooms = cursor.fetchall()

    if not available_rooms:
        return jsonify({"error": "No rooms available for the selected dates."}), 404

    # Prepare response data
    rooms_data = [
        {"room_id": room["room_id"], "room_type": room["room_type"], "room_price": room["price"], "is_available": bool(room["is_available"])}
        for room in available_rooms
    ]

    conn.close()

    return jsonify({"available_rooms": rooms_data}), 200



@bookings_bp.route('/bookings', methods=['GET'])
def get_bookings():
    conn = get_db_connection()
    bookings = conn.execute('SELECT * FROM bookings').fetchall()
    conn.close()
    return jsonify([dict(booking) for booking in bookings]) 
@bookings_bp.route('/bookings/<int:room_id>', methods=['GET'])
def get_booking(room_id):
    booking = next((b for b in bookings if b['roomId'] == room_id), None)
    return jsonify(booking) if booking else ('', 404)

@bookings_bp.route('/bookings/<int:room_id>', methods=['DELETE'])
def delete_booking(room_id):
    global bookings
    bookings = [b for b in bookings if b['roomId'] != room_id]
    return ('', 204)


@bookings_bp.route('/available-rooms', methods=['POST'])
def get_available_rooms():
    data = request.json
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Fetch available rooms based on the check-in and check-out dates
        cursor.execute('''
            SELECT room_id FROM rooms 
            WHERE room_id NOT IN (
                SELECT room_id FROM bookings 
                WHERE (check_in_date <= ? AND check_out_date >= ?)
            )
        ''', (check_out_date, check_in_date))
        
        available_rooms = cursor.fetchall()
        
        # Extract room IDs from the fetched data
        room_ids = [{'room_id': room[0]} for room in available_rooms]
        
        return jsonify({'availableRooms': room_ids}), 200
    except Exception as e:
        print(f"Error fetching available rooms: {e}")
        return jsonify({'error': 'Failed to fetch available rooms.'}), 500
    finally:
        conn.close()


