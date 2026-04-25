# 🚀 How to Start the Movie Ticket System

This guide explains how to start all the components of the Movie Ticket System locally. Since it uses a microservices architecture, you need to start the message broker (Redis), the four backend services, and the frontend separately.

## Prerequisites

- **Node.js** (v16+) installed
- **Docker Desktop** installed and running (required for Redis)

---

## Step 1: Start Redis (Message Broker)

The system uses Redis Pub/Sub for asynchronous communication between services.

1. Open a terminal.
2. Run the following command to start a Redis container:
   ```bash
   docker run -d --name redis-movie-ticket -p 6379:6379 redis:alpine
   ```
   *(Note: If you already have a Redis container running on port 6379, you can skip this step.)*

---

## Step 2: Start the Backend Services

You need to open **4 separate terminal windows** (or tabs), one for each service. All services must be running simultaneously.

Navigate to the project root folder (`tuan7`) in each terminal, then run:

**Terminal 1 (User Service - Port 8081):**
```bash
cd user-service
npm start
```

**Terminal 2 (Movie Service - Port 8082):**
```bash
cd movie-service
npm start
```

**Terminal 3 (Booking Service - Port 8083):**
```bash
cd booking-service
npm start
```

**Terminal 4 (Payment + Notification Service - Port 8084):**
```bash
cd payment-service
npm start
```

*Wait for all services to say "Database synced" and "Running on http://localhost:808X".*

---

## Step 3: Start the Frontend

Open a **5th terminal window**, navigate to the project root, and start the React app:

**Terminal 5 (Frontend - Port 3000):**
```bash
cd frontend
npm run dev
```

---

## Step 4: Test the System

1. Open your browser and go to **http://localhost:3000**
2. **Sign Up** for a new account.
3. Browse the **Movies** page and select a movie.
4. Choose a seat and click **Confirm Booking**.
5. Go to the **My Bookings** tab. You will initially see the status as `PENDING`.
6. Wait a few seconds (the system simulates a payment delay of 1-3 seconds), and the status will automatically update to `CONFIRMED` or `FAILED` without refreshing the page!

### 💡 Viewing the Events in Action

To see the Event-Driven Architecture working, look at the terminal logs of your backend services while you book a ticket:
- **Booking Service** logs will show it publishing `BOOKING_CREATED`.
- **Payment Service** logs will show it receiving the event, processing the payment, and publishing `PAYMENT_COMPLETED` (or `FAILED`).
- **Booking Service** logs will show it receiving the payment result and updating the database.
