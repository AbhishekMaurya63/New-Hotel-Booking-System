from flask import Blueprint, jsonify, request # type: ignore
import sqlite3
guests_bp = Blueprint('guests', __name__)
def get_db_connection():
    conn = sqlite3.connect('hotel_management.db')
    conn.row_factory = sqlite3.Row  # To access rows as dictionaries
    return conn

@guests_bp.route('/guests', methods=['POST'])
def add_Guest():
    conn = get_db_connection()
    guest_Name=request.form.get('guestName')
    guest_email=request.form.get('email')
    print(guest_Name,guest_email)
    if not guest_Name or not guest_email:
        return jsonify({"error": "All fields are required."}), 400
    try:
        conn.execute(f'insert into guests(name,email) values("{guest_Name}","{guest_email}")')
    
        conn.commit()
    except:
        return jsonify({"error": "Guest Email already registerd"}), 400
    finally:
        conn.close()
    return jsonify({"success": "Guest registerd Successfully"}), 200

@guests_bp.route('/guests', methods=['GET'])
def get_guests():
    conn = get_db_connection()
    guests = conn.execute('SELECT * FROM guests').fetchall()
    conn.close()
    return jsonify([dict(guest) for guest in guests]) 

@guests_bp.route('/guests/<int:guest_id>', methods=['GET'])
def show_guest(guest_id):
    conn = get_db_connection()
    guest=conn.execute('SELECT * FROM guests WHERE guest_id = ?', (guest_id,)).fetchone()
    conn.close()
    if guest is None:
        return jsonify({"error": "Guest not found"}), 404
    return jsonify(dict(guest))

@guests_bp.route('/guests/<int:guest_id>', methods=['DELETE'])
def delete_guest(guest_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM guests WHERE guest_id = ?', (guest_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": f"Guests {guest_id} deleted successfully"}), 200

@guests_bp.route('/guests/<int:guest_id>', methods=['PUT'])
def update_guests(guest_id):
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')

    if name is None or email is None:
        return jsonify({"error": "All Guests fields are required"}), 400

    conn = get_db_connection()
    try:
        conn.execute(
            'UPDATE guests SET name = ?, email = ? WHERE guest_id = ?',
            (name, email, guest_id)
        )
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"success": "Guests updated successfully"}), 200