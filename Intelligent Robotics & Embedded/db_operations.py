import psycopg2
from psycopg2 import sql
import time
from datetime import datetime
import uuid


DB_PARAMS = {
    'dbname': 'pms',
    'user': 'postgres',
    'password': 'nzabera2006',
    'host': 'localhost',
    'port': '5432'
}

def get_timestamp():
    """Return the current timestamp in a formatted string."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def print_boxed_message(message, border_char="=", width=50):
    """Helper function to print a message in a boxed format."""
    border = border_char * width
    padding = " " * ((width - len(message) - 2) // 2)
    print(border)
    print(f"|{padding}{message}{padding}{' ' if len(message) % 2 else ''}|")
    print(border)

def connect_to_db():
    """Establish a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        return conn
    except Exception as e:
        print_boxed_message("Database Connection Error", "!")
        print(f"[{get_timestamp()}] Error connecting to database: {e}")
        return None

def initialize_db():
    """Create the necessary tables if they don't exist."""
    conn = connect_to_db()
    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            # Create plates_log table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS plates_log (
                    id UUID PRIMARY KEY,
                    plate_number VARCHAR(10) NOT NULL,
                    payment_status INTEGER DEFAULT 0,
                    entry_timestamp TIMESTAMP NOT NULL,
                    payment_timestamp TIMESTAMP,
                    exit_timestamp TIMESTAMP,
                    exit_status VARCHAR(100),
                    amount_charged NUMERIC(10, 2)
                )
            """)
            conn.commit()
            print(f"[{get_timestamp()}] Database initialized successfully.")
            return True
    except Exception as e:
        print_boxed_message("Database Initialization Error", "!")
        print(f"[{get_timestamp()}] Error initializing database: {e}")
        return False
    finally:
        conn.close()

def log_plate_entry(plate, payment_status=0):
    """Log a new plate entry to the database if it hasn't already entered and not exited."""
    conn = connect_to_db()
    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            # Check for existing entry with no exit timestamp
            cursor.execute("""
                SELECT id FROM plates_log
                WHERE plate_number = %s AND exit_timestamp IS NULL
                ORDER BY entry_timestamp DESC
                LIMIT 1
            """, (plate,))
            result = cursor.fetchone()

            if result is not None:
                print(f"[SKIP] Plate {plate} already logged without exit. Skipping entry.")
                return None

            # No existing un-exited entry, proceed to log new entry
            timestamp = get_timestamp()
            plate_id = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO plates_log (id, plate_number, payment_status, entry_timestamp)
                VALUES (%s, %s, %s, %s)
            """, (plate_id, plate, payment_status, timestamp))
            conn.commit()
            print(f"[ENTRY] Plate {plate} logged at {timestamp}.")
            return timestamp
    except Exception as e:
        print_boxed_message("Database Insert Error", "!")
        print(f"[{get_timestamp()}] Error logging plate to database: {e}")
        return None
    finally:
        conn.close()


def read_last_unpaid_entry(plate):
    """Read the last unpaid entry (Payment Status = 0) for a given plate from database."""
    conn = connect_to_db()
    if conn is None:
        return None

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT plate_number, payment_status, entry_timestamp::text
                FROM plates_log
                WHERE plate_number = %s AND payment_status = 0
                ORDER BY entry_timestamp DESC
                LIMIT 1
            """, (plate,))

            result = cursor.fetchone()
            if result is None:
                return None

            return {
                'Plate Number': result[0],
                'Payment Status': str(result[1]),
                'Timestamp': result[2]
            }
    except Exception as e:
        print_boxed_message("Database Query Error", "!")
        print(f"[{get_timestamp()}] Error reading from database: {e}")
        return None
    finally:
        conn.close()

def update_payment_status(plate, entry_timestamp, amount_charged=None):
    """Update the Payment Status to 1, log the payment timestamp, and store the amount charged."""
    conn = connect_to_db()
    if conn is None:
        return None

    try:
        with conn.cursor() as cursor:
            payment_time = get_timestamp()
            if amount_charged is not None:
                cursor.execute("""
                    UPDATE plates_log
                    SET payment_status = 1, payment_timestamp = %s, amount_charged = %s
                    WHERE plate_number = %s AND entry_timestamp::text = %s AND payment_status = 0
                """, (payment_time, amount_charged, plate, entry_timestamp))
            else:
                cursor.execute("""
                    UPDATE plates_log
                    SET payment_status = 1, payment_timestamp = %s
                    WHERE plate_number = %s AND entry_timestamp::text = %s AND payment_status = 0
                """, (payment_time, plate, entry_timestamp))

            if cursor.rowcount == 0:
                print(f"[{get_timestamp()}] No matching unpaid entry found for plate {plate}.")
                return None

            conn.commit()
            return payment_time
    except Exception as e:
        print_boxed_message("Database Update Error", "!")
        print(f"[{get_timestamp()}] Error updating payment status: {e}")
        return None
    finally:
        conn.close()

def is_payment_complete(plate):
    """Check if the latest entry for a plate is paid (payment_status = 1)."""
    conn = connect_to_db()
    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT payment_status
                FROM plates_log
                WHERE plate_number = %s
                ORDER BY entry_timestamp DESC
                LIMIT 1
            """, (plate,))
            result = cursor.fetchone()
            if result is None:
                return False
            return result[0] == 1  # True if latest entry is paid
    except Exception as e:
        print_boxed_message("Database Query Error", "!")
        print(f"[{get_timestamp()}] Error checking payment status: {e}")
        return False
    finally:
        conn.close()


def process_payment(plate, balance, ser):
    """Process payment for a plate."""
    conn = connect_to_db()
    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            # Get the last unpaid entry
            cursor.execute("""
                SELECT entry_timestamp
                FROM plates_log
                WHERE plate_number = %s AND payment_status = 0
                ORDER BY entry_timestamp DESC
                LIMIT 1
            """, (plate,))

            result = cursor.fetchone()
            if result is None:
                print(f"[{get_timestamp()}] No unpaid entry found for plate {plate}.")
                return False

            entry_time_str = result[0].strftime('%Y-%m-%d %H:%M:%S')
            entry_time = result[0]
            exit_time = datetime.now()
            # Calculate minutes spent, with a minimum of 1 minute
            minutes_spent = max(1, int((exit_time - entry_time).total_seconds() / 60))
            # Use a rate of 8 units per minute (500 RWF per hour / 60 minutes)
            amount_due = minutes_spent * 8  # RATE_PER_MINUTE = 8

            if balance < amount_due:
                print("[PAYMENT] Insufficient balance")
                ser.write(b'I\n')
                return False
            else:
                new_balance = balance - amount_due

                # Wait for Arduino to send "READY"
                print("[WAIT] Waiting for Arduino to be READY...")
                start_time = time.time()
                while True:
                    if ser.in_waiting:
                        arduino_response = ser.readline().decode().strip()
                        print(f"[ARDUINO] {arduino_response}")
                        if arduino_response == "READY":
                            break
                    if time.time() - start_time > 5:
                        print("[ERROR] Timeout waiting for Arduino READY")
                        return False

                # Send new balance
                ser.write(f"{new_balance}\r\n".encode())
                print(f"[PAYMENT] Sent new balance {new_balance}")

                # Wait for confirmation with timeout
                start_time = time.time()
                print("[WAIT] Waiting for Arduino confirmation...")
                while True:
                    if ser.in_waiting:
                        confirm = ser.readline().decode().strip()
                        print(f"[ARDUINO] {confirm}")
                        if "DONE" in confirm:
                            print("[ARDUINO] Write confirmed")
                            # Update payment status and store amount charged
                            update_payment_status(plate, entry_time_str, amount_due)
                            return True

                    # Add timeout condition
                    if time.time() - start_time > 10:
                        print("[ERROR] Timeout waiting for confirmation")
                        return False

                    # Small delay to avoid CPU spinning
                    time.sleep(0.1)
    except Exception as e:
        print_boxed_message("Database Payment Error", "!")
        print(f"[{get_timestamp()}] Error processing payment: {e}")
        return False
    finally:
        conn.close()

def mark_payment_success(plate_number):
    """Mark payment as successful for a plate."""
    conn = connect_to_db()
    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            # Get the last unpaid entry
            cursor.execute("""
                SELECT entry_timestamp::text
                FROM plates_log
                WHERE plate_number = %s AND payment_status = 0
                ORDER BY entry_timestamp DESC
                LIMIT 1
            """, (plate_number,))

            result = cursor.fetchone()
            if result is None:
                print(f"[INFO] No unpaid record found for {plate_number}")
                return False

            entry_timestamp = result[0]
            # Since this is a manual payment success marking, we don't have amount information
            payment_time = update_payment_status(plate_number, entry_timestamp)

            if payment_time:
                print(f"[UPDATED] Payment status set to 1 for {plate_number}")
                return True
            else:
                return False
    except Exception as e:
        print_boxed_message("Database Update Error", "!")
        print(f"[{get_timestamp()}] Error marking payment as successful: {e}")
        return False
    finally:
        conn.close()

def update_exit_status(plate_number, status):
    """Update the exit status for a plate."""
    conn = connect_to_db()
    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            # Get the most recent paid entry without an exit timestamp
            cursor.execute("""
                SELECT id
                FROM plates_log
                WHERE plate_number = %s AND payment_status = 1 AND exit_timestamp IS NULL
                ORDER BY payment_timestamp DESC
                LIMIT 1
            """, (plate_number,))

            result = cursor.fetchone()
            if result is None:
                print(f"[INFO] No paid entry without exit time found for {plate_number}")
                return False

            entry_id = result[0]
            exit_time = get_timestamp()

            # Update the exit timestamp and status
            cursor.execute("""
                UPDATE plates_log
                SET exit_timestamp = %s, exit_status = %s
                WHERE id = %s
            """, (exit_time, status, entry_id))

            conn.commit()
            print(f"[EXIT] Recorded exit time {exit_time} for plate {plate_number} with status: {status}")
            return True
    except Exception as e:
        print_boxed_message("Database Exit Record Error", "!")
        print(f"[{get_timestamp()}] Error recording exit status: {e}")
        return False
    finally:
        conn.close()

def log_plate_exit(plate_number, exit_status=None):
    """Record the exit time for a plate.

    Args:
        plate_number: The license plate number
        exit_status: Optional status to record any incidents during exit
    """
    conn = connect_to_db()
    if conn is None:
        return False

    try:
        with conn.cursor() as cursor:
            # For access denied (unpaid), we need to record the incident
            if exit_status == "DENIED":
                # Check if there's already a DENIED record for this plate
                cursor.execute("""
                    SELECT id
                    FROM plates_log
                    WHERE plate_number = %s AND exit_timestamp IS NULL AND exit_status = 'DENIED'
                    ORDER BY entry_timestamp DESC
                    LIMIT 1
                """, (plate_number,))

                if cursor.fetchone() is not None:
                    print(f"[SKIP] Plate {plate_number} already has a DENIED exit status. Skipping update.")
                    return True

                # Get the most recent entry without an exit timestamp, regardless of payment status
                cursor.execute("""
                    SELECT id
                    FROM plates_log
                    WHERE plate_number = %s AND exit_timestamp IS NULL
                    ORDER BY entry_timestamp DESC
                    LIMIT 1
                """, (plate_number,))
            else:
                # Check if there's already an exit record with the specified status for this plate
                cursor.execute("""
                    SELECT id
                    FROM plates_log
                    WHERE plate_number = %s AND exit_timestamp IS NOT NULL AND exit_status = %s
                    ORDER BY exit_timestamp DESC
                    LIMIT 1
                """, (plate_number, exit_status))

                if cursor.fetchone() is not None:
                    print(f"[SKIP] Plate {plate_number} already has a NORMAL exit record. Skipping update.")
                    return True

                # For normal exits, get the most recent paid entry without an exit timestamp
                cursor.execute("""
                    SELECT id, amount_charged
                    FROM plates_log
                    WHERE plate_number = %s AND payment_status = 1 AND exit_timestamp IS NULL AND exit_status IS NULL
                    ORDER BY payment_timestamp DESC
                    LIMIT 1
                """, (plate_number,))

            result = cursor.fetchone()
            if result is None:
                print(f"[INFO] No suitable entry without exit time found for {plate_number}")
                return False

            entry_id = result[0]
            exit_time = get_timestamp()

            # Get amount charged if available (for normal exits)
            amount_charged = result[1] if exit_status != "DENIED" and len(result) > 1 else None

            # Update the exit timestamp and status
            if exit_status == "DENIED":
                # For denied exits, only update the exit_status without setting exit_timestamp
                cursor.execute("""
                    UPDATE plates_log
                    SET exit_status = %s
                    WHERE id = %s
                """, (exit_status, entry_id))
                print(f"[EXIT] Recorded incident for plate {plate_number} with status: {exit_status}")
            elif exit_status:
                # For normal exits with status, update both exit_timestamp and exit_status
                cursor.execute("""
                    UPDATE plates_log
                    SET exit_timestamp = %s, exit_status = %s
                    WHERE id = %s
                """, (exit_time, exit_status, entry_id))
                if amount_charged is not None:
                    print(f"[EXIT] Recorded exit time {exit_time} for plate {plate_number} with status: {exit_status}, amount charged: {amount_charged}")
                else:
                    print(f"[EXIT] Recorded exit time {exit_time} for plate {plate_number} with status: {exit_status}")
            else:
                # For exits without status, just update exit_timestamp
                cursor.execute("""
                    UPDATE plates_log
                    SET exit_timestamp = %s
                    WHERE id = %s
                """, (exit_time, entry_id))
                if amount_charged is not None:
                    print(f"[EXIT] Recorded exit time {exit_time} for plate {plate_number}, amount charged: {amount_charged}")
                else:
                    print(f"[EXIT] Recorded exit time {exit_time} for plate {plate_number}")

            conn.commit()
            return True
    except Exception as e:
        print_boxed_message("Database Exit Record Error", "!")
        print(f"[{get_timestamp()}] Error recording exit time: {e}")
        return False
    finally:
        conn.close()


# Initialize the database when the module is imported
if __name__ == "__main__":
    initialize_db()
