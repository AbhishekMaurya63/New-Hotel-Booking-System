from flask import Flask,request, render_template,jsonify,redirect, url_for,session # type: ignore
import sqlite3
from rooms import rooms_bp  # Import the rooms blueprint
from guests import guests_bp
from bookings import bookings_bp
from datetime import datetime
from database import get_total_revenue
import bcrypt # type: ignore

def get_db_connection():
    conn = sqlite3.connect('hotel_management.db')
    conn.row_factory = sqlite3.Row  # To access rows as dictionaries
    return conn
app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.register_blueprint(rooms_bp, url_prefix='/api')
app.register_blueprint(guests_bp, url_prefix='/api')
app.register_blueprint(bookings_bp, url_prefix='/api')

# Route to serve HTML page
@app.route('/index')
def index():
    if 'user_email' not in session:
        return redirect(url_for('login')) 
    return render_template('index.html', user_email=session['user_email'])
@app.route('/rooms')
def rooms():
    if 'user_email' not in session:
        return redirect(url_for('login')) 
    return render_template('rooms.html', user_email=session['user_email'])
@app.route('/guests')
def guests():
    if 'user_email' not in session:
        return redirect(url_for('login')) 
    return render_template('guests.html', user_email=session['user_email'])
@app.route('/bookings')
def bookings():
    if 'user_email' not in session:
        return redirect(url_for('login')) 
    return render_template('bookings.html', user_email=session['user_email'])
@app.route('/')
def register():
    return render_template('Register.html')
@app.route('/revenue')
def revenue():
    if 'user_email' not in session:
        return redirect(url_for('login')) 
    return render_template('revenue.html', user_email=session['user_email'])

@app.route('/registerEmp', methods=['POST'])
def registerEmp():
    conn = get_db_connection()
    emp_name = request.form.get('name')
    emp_email = (request.form.get('email')).lower()
    emp_password = request.form.get('password')
    current_date = datetime.now()
    formatted_date = current_date.strftime("%d-%m-%Y")

    if not emp_name or not emp_email or not emp_password:
        return jsonify({"error": "All fields are required."}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(emp_password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn.execute(
            'INSERT INTO empregister (emp_name, emp_email, password, reg_Date) VALUES (?, ?, ?, ?)',
            (emp_name, emp_email, hashed_password, formatted_date)
        )
        conn.commit()
        session['user_email'] = emp_email
    except sqlite3.IntegrityError as e:
        print(e)
        return jsonify({"error": "Email already registered"}), 400
    finally:
        conn.close()
    return jsonify({"success": "Employee Registered Successfully"})


@app.route('/loginEmp', methods=['POST'])
def loginEmp():
    conn = get_db_connection()
    emp_email = (request.form.get('email')).lower()
    emp_password = request.form.get('password')
    
    if not emp_email or not emp_password:
        return jsonify({"error": "Email and password are required."}), 400

    try:
        # Fetch the user record by email
        user = conn.execute(
            'SELECT * FROM empregister WHERE emp_email = ?', (emp_email,)
        ).fetchone()

        if user:
            # Check if the hashed password matches the provided password
            if bcrypt.checkpw(emp_password.encode('utf-8'), user['password']):
                session['user_email'] = emp_email
                return jsonify({"success": "Login Successful"})  # Redirect logic handled by frontend
            else:
                return jsonify({"error": "Incorrect password."}), 400
        else:
            return jsonify({"error": "User not registered."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        conn.close()

    
        
        
@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/logout')
def logout():
    session.pop('user_email', None)  # Remove user session
    return redirect(url_for('login'))


@app.route('/dashboard-data', methods=['GET'])
def get_dashboard_data():
    conn = get_db_connection()
    emp_email=session['user_email']
    try:
        # Fetch counts from the database
        # emp_name=conn.execute('SELECT emp_name from empregister where emp_email=?',(emp_email)).fetchone()[0]
        emp_name = conn.execute('SELECT emp_name FROM empregister WHERE emp_email = ?', (emp_email,)).fetchone()[0]

        total_rooms = conn.execute('SELECT COUNT(*) FROM rooms').fetchone()[0]
        total_bookings= conn.execute('SELECT COUNT(*) FROM bookings').fetchone()[0]
        total_guests = conn.execute('SELECT COUNT(*) FROM guests').fetchone()[0]
        total_revenue = get_total_revenue()
        # Calculate total revenue (example, assuming revenue is a column in bookings table)
        # total_revenue = conn.execute('SELECT SUM(revenue) FROM bookings').fetchone()[0] or 0
        
        return jsonify({
            "total_rooms": total_rooms,
            "occupied_rooms": total_bookings,
            "total_guests": total_guests,
            "total_revenue": total_revenue,
            "emp_name":emp_name
        })
    finally:
        conn.close()
    



@app.route('/revenueData', methods=['GET'])
def dashboard_data():
    # conn = get_db_connection()
    # conn.execute("SELECT COUNT(*) FROM rooms")
        # Total Revenue
    total_revenue = get_total_revenue()

    return jsonify({
        "total_revenue": total_revenue
    })

# Endpoint for date-filtered revenue
@app.route('/total_revenue', methods=['GET'])
def total_revenue():
    conn = get_db_connection()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    revenue=conn.execute('''SELECT SUM(r.price) FROM bookings b
                              JOIN rooms r ON b.room_id = r.room_id
                              WHERE b.check_in_date >= ? AND b.check_out_date <= ?''',
                           (start_date, end_date)).fetchone()[0]
    # revenue = get_total_revenue(start_date, end_date)
    if(revenue):
     return jsonify({"total_revenue": revenue})
    else:
        return jsonify({"total_revenue": 0})



if __name__ == "__main__":
    app.run(debug=False,host='0.0.0.0', port=5000)
