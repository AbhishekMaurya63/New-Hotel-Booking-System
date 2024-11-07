# database.py

import sqlite3
from contextlib import contextmanager

@contextmanager
def connect_db(db_name="hotel_management.db"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    try:
        yield cursor
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def create_tables():
    with connect_db() as cursor:
        cursor.execute('''CREATE TABLE IF NOT EXISTS rooms (
                            room_id INTEGER PRIMARY KEY, 
                            room_type TEXT, 
                            price REAL, 
                            available INTEGER)''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS guests (
                            guest_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            name TEXT, 
                            email TEXT)''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS bookings (
                            booking_id INTEGER PRIMARY KEY, 
                            guest_id INTEGER, 
                            room_id INTEGER, 
                            check_in_date TEXT, 
                            check_out_date TEXT, 
                            FOREIGN KEY(guest_id) REFERENCES guests(guest_id), 
                            FOREIGN KEY(room_id) REFERENCES rooms(room_id))''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS empregister (
                            emp_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            emp_name TEXT, 
                            emp_email TEXT UNIQUE, 
                            password TEXT, 
                            reg_Date TEXT)
                            ''')
create_tables()

from datetime import datetime

def get_total_revenue(start_date=None, end_date=None):
    query = '''
        SELECT SUM(rooms.price * (julianday(bookings.check_out_date) - julianday(bookings.check_in_date))) 
        FROM bookings
        JOIN rooms ON bookings.room_id = rooms.room_id
    '''
    params = []

    if start_date and end_date:
        query += " WHERE bookings.check_in_date >= ? AND bookings.check_out_date <= ?"
        params.extend([start_date, end_date])

    with connect_db() as cursor:
        cursor.execute(query, params)
        revenue = cursor.fetchone()[0]
    
    return revenue or 0.0 

if __name__ == "__main__":
    connect_db()
