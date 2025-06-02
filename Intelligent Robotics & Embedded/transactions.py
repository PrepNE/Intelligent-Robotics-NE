import serial
import time
from datetime import datetime
import db_operations
# Configure the serial port (adjust 'COM14' to your Arduino's port)
ser = serial.Serial('COM10', 9600, timeout=1)
time.sleep(2)  # Wait for serial to initialize
def print_boxed_message(message, border_char="=", width=50):
    """Helper function to print a message in a boxed format."""
    border = border_char * width
    padding = " " * ((width - len(message) - 2) // 2)
    print(border)
    print(f"|{padding}{message}{padding}{' ' if len(message) % 2 else ''}|")
    print(border)
def get_timestamp():
    """Return the current timestamp in a formatted string."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
def read_last_unpaid_entry(plate):
    """Read the last unpaid entry (Payment Status = 0) for a given plate from database."""
    return db_operations.read_last_unpaid_entry(plate)
def update_payment_status(plate, entry_timestamp, amount_charged=None):
    """Update the Payment Status to 1, log the payment timestamp, and store the amount charged."""
    return db_operations.update_payment_status(plate, entry_timestamp, amount_charged)
try:
    print_boxed_message("Python Parking System Ready", "=")
    print(f"[{get_timestamp()}] Waiting for Arduino data...\n")
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').strip()
            if line.startswith("DATA:"):
                print(line)
                # Parse the data
                plate, cash = line[5:].split(',')
                cash = int(cash)
                # Display received data
                print_boxed_message("Data Received from Arduino", "-")
                print(f"[{get_timestamp()}] Details:")
                print(f"  License Plate: {plate}")
                print(f"  Current Balance: {cash} units\n")
                # Check if cash is more than 200
                if cash <= 200:
                    print_boxed_message("Error: Insufficient Balance", "!")
                    print(f"[{get_timestamp()}] Balance ({cash} units) must be > 200 units.\n")
                    continue
                # Read the last unpaid entry for the plate
                last_entry = read_last_unpaid_entry(plate)
                if last_entry is None:
                    print_boxed_message("Warning: No Unpaid Entry Found", "!")
                    print(f"[{get_timestamp()}] No unpaid entry for plate {plate}. Assuming 0 hours.\n")
                    hours = 0
                else:
                    entry_time = datetime.strptime(last_entry['Timestamp'], "%Y-%m-%d %H:%M:%S")
                    current_time = datetime.now()
                    time_diff = current_time - entry_time
                    hours = time_diff.total_seconds() / 3600  # Convert to hours
                # Calculate charge (8 units per minute = 500 RWF per hour)
                minutes = hours * 60
                # Ensure at least 1 minute is charged
                minutes_spent = max(1, int(minutes))
                charge = minutes_spent * 8
                if charge > cash:
                    print_boxed_message("Error: Charge Exceeds Balance", "!")
                    print(f"[{get_timestamp()}] Charge ({charge} units) exceeds balance ({cash} units).\n")
                    continue
                # Send charge to Arduino
                ser.write(f"CHARGE:{charge}\n".encode())
                print_boxed_message("Data Sent to Arduino", "-")
                print(f"[{get_timestamp()}] Transaction Details:")
                print(f"  License Plate: {plate}")
                print(f"  Parking Duration: {hours:.2f} hours")
                print(f"  Charge Amount: {charge} units\n")
                # Wait for DONE signal
                response = ser.readline().decode('utf-8').strip()
                if response == "DONE":
                    if last_entry:
                        payment_time = update_payment_status(plate, last_entry['Timestamp'], charge)
                        if payment_time:
                            print_boxed_message("Payment Processed", "-")
                            print(f"[{get_timestamp()}] Payment Details:")
                            print(f"  Payment Timestamp: {payment_time}")
                            print(f"  Updated Balance: {cash - charge} units\n")
                    print_boxed_message("Transaction Successful", "=")
                    print(f"[{get_timestamp()}] Gate is opening...\n")
                else:
                    print_boxed_message("Error: Arduino Response", "!")
                    print(f"[{get_timestamp()}] Unexpected response: {response}\n")
        time.sleep(0.1)  # Small delay to prevent overwhelming the loop
except KeyboardInterrupt:
    print("\n" + "=" * 50)
    print(f"[{get_timestamp()}] Program terminated by user.")
    print("=" * 50)
    ser.close()
except Exception as e:
    print("\n" + "=" * 50)
    print(f"[{get_timestamp()}] An error occurred: {e}")
    print("=" * 50)
    ser.close()
finally:
    ser.close()
