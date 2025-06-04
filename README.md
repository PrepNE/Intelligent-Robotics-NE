# Parking Management System

This repository contains a complete Parking Management System with two main components:
1. A web-based dashboard for monitoring and management
2. An Intelligent Robotics & Embedded system for automated car entry, exit, and payment processing

## Dashboard Setup and Running Instructions

The dashboard consists of a frontend built with React and a backend built with Node.js.

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd RestTemplate\dashboard\backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up the database (if needed):
   ```bash
   pnpm prisma:seed
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

The backend server will start on the default port (usually 5000).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd RestTemplate\dashboard\frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The frontend development server will start on port 3000. You can access the dashboard at http://localhost:3000.

## Intelligent Robotics & Embedded System

The Intelligent Robotics & Embedded system handles car entry, exit, and payment processing using computer vision and Arduino-based hardware.

### Prerequisites

- Python 3.8 or higher
- Tesseract OCR installed on your system
- Arduino IDE (for uploading sketches to Arduino boards)
- Webcam
- Arduino boards connected to your computer

### Installation

1. Navigate to the Intelligent Robotics & Embedded directory:
   ```bash
   cd "Intelligent Robotics & Embedded"
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

The requirements.txt file includes:
- psycopg2-binary==2.9.9
- opencv-python
- ultralytics
- pytesseract
- pyserial

### Running Car Entry System

The car entry system detects license plates of incoming cars and logs their entry in the database.

```bash
python car_entry.py
```

This script:
- Uses a webcam to capture video
- Detects license plates using a YOLO model
- Extracts plate numbers using OCR
- Logs the entry in the database
- Controls an entry gate via Arduino (if connected)

### Running Car Exit System

The car exit system detects license plates of exiting cars, checks if payment is complete, and logs their exit.

```bash
python car_exit.py
```

This script:
- Uses a webcam to capture video
- Detects license plates using a YOLO model
- Extracts plate numbers using OCR
- Checks if payment is complete
- Logs the exit in the database
- Controls an exit gate via Arduino (if connected)

### Running Payment Processing

The payment processing system reads payment data from an Arduino and processes payments.

```bash
python process_payment.py
```

This script:
- Connects to an Arduino that reads payment information
- Processes payments for parked cars
- Updates payment status in the database

## Hardware Setup

For the Intelligent Robotics & Embedded system to work properly, you need:

1. Arduino boards connected to your computer:
   - One for the entry gate (COM8 by default)
   - One for the exit gate (COM9 by default)
   - One for payment processing (COM9 by default)

2. A webcam for license plate detection

3. Tesseract OCR installed on your system with the path configured in the scripts

## Notes

- The system is designed to work with Rwandan license plates (format: RABxxxC)
- The payment rate is set to 8 units per minute (500 RWF per hour)
- Make sure the Arduino ports in the scripts match your actual Arduino connections
