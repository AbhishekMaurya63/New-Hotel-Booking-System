from flask import Blueprint, jsonify, request # type: ignore
import sqlite3
rooms_bp = Blueprint('rooms', __name__)
def get_db_connection():
    conn = sqlite3.connect('hotel_management.db')
    conn.row_factory = sqlite3.Row  # To access rows as dictionaries
    return conn

@rooms_bp.route('/rooms', methods=['POST'])
def add_room():
    conn = get_db_connection()
    room_number = request.form.get('roomNumber')  # Use .get() to avoid KeyError
    room_type = request.form.get('roomType')      # Use .get() to avoid KeyError
    room_price = request.form.get('roomPrice')    # Use .get() to avoid KeyError

    if not room_number or not room_type or not room_price:
        return jsonify({"error": "All fields are required."}), 400
    try:
        conn.execute(f'insert into rooms(room_id,room_type,price,available) values({room_number},"{room_type}",{room_price},0)')
    
        conn.commit()
    except:
        return jsonify({"error": "Room number already registerd"}), 400
    finally:
        conn.close()
    return jsonify({"success": "Room registerd Successfully"}), 200


@rooms_bp.route('/rooms', methods=['GET'])
def get_rooms():
    conn = get_db_connection()
    rooms = conn.execute('SELECT * FROM rooms').fetchall()
    conn.close()
    return jsonify([dict(room) for room in rooms]) 


@rooms_bp.route('/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM rooms WHERE room_id = ?', (room_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": f"Room {room_id} deleted successfully"}), 200

@rooms_bp.route('/rooms/<int:room_id>', methods=['GET'])
def show_room(room_id):
    conn = get_db_connection()
    room=conn.execute('SELECT * FROM rooms WHERE room_id = ?', (room_id,)).fetchone()
    conn.close()
    if room is None:
        return jsonify({"error": "Room not found"}), 404
    return jsonify(dict(room))

@rooms_bp.route('/rooms/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    data = request.get_json()
    
    room_type = data.get('room_type')
    price = data.get('price')
    available = data.get('available')

    if room_type is None or price is None or available is None:
        return jsonify({"error": "All room fields are required"}), 400

    conn = get_db_connection()
    try:
        conn.execute(
            'UPDATE rooms SET room_type = ?, price = ?, available = ? WHERE room_id = ?',
            (room_type, price, available, room_id)
        )
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"success": "Room updated successfully"}), 200

