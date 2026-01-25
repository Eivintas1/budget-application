Budget Tracker App

A simple full-stack budget tracker built using FastAPI and React.

This project was created to learn how a frontend application communicates with a backend API.

------------------------------------------------------------

Features
- Add income and expense transactions
- View a list of transactions
- Filter transactions (All / Income / Expense)
- Automatically calculate total income, total expenses, and balance
- Delete transactions

------------------------------------------------------------

Tech Used
- Frontend: React (Vite), JavaScript, CSS
- Backend: FastAPI, Python

------------------------------------------------------------

How It Works
- The backend provides API endpoints for transactions
- The frontend sends and receives data using fetch()
- Transactions are stored in memory while the backend is running
- Restarting the backend clears all data

------------------------------------------------------------

API Endpoints
GET    /transactions        Get all transactions
POST   /transactions        Add a new transaction
DELETE /transactions/{id}   Delete a transaction
GET    /health              Health check

------------------------------------------------------------

Running the Backend

1. Open a terminal in the backend folder
2. Activate the virtual environment
3. Run the server

Commands:
.\.venv\Scripts\activate
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000

Backend runs at:
http://127.0.0.1:8000

------------------------------------------------------------

Running the Frontend

1. Open a terminal in the frontend folder
2. Install dependencies
3. Start the dev server

Commands:
npm install
npm run dev

Frontend runs at:
http://localhost:5173

------------------------------------------------------------

Limitations
- No database (data is not persistent)
- No authentication
- No edit functionality

------------------------------------------------------------

Project Status
Complete
