from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/transactions")
def get_transactions():
    return [
        {
            "id": 1,
            "amount": 100.0,
            "currency": "USD",
            "status": "completed"
        },
        {
            "id": 2,
            "amount": 250.5,
            "currency": "EUR",
            "status": "pending"
        }
    ]