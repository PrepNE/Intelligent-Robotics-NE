import db_operations

# Initialize the database
db_operations.initialize_db()

def mark_payment_success(plate_number):
    """Mark payment as successful for a plate using the database."""
    success = db_operations.mark_payment_success(plate_number)
    if not success:
        print(f"[INFO] No unpaid record found for {plate_number}")

# ==== TESTING USAGE ====
if __name__ == "__main__":
    plate = input("Enter plate number to mark as paid: ").strip().upper()
    mark_payment_success(plate)
