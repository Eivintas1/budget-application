from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Literal

app = FastAPI()

# What the user SENDS (no id)
class TransactionIn(BaseModel):
    date: str
    type: Literal["Income", "Expense"]
    category: str
    description: str
    amount: float

# What the server RETURNS (has id)
class TransactionOut(TransactionIn):
    id: int

transactions: list[TransactionOut] = []
next_id = 1

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/transactions")
def add_transaction(tx: TransactionIn):
    global next_id

    if tx.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be > 0")

    new_tx = TransactionOut(id=next_id, **tx.model_dump())
    next_id += 1
    transactions.append(new_tx)
    return new_tx

@app.get("/transactions")
def get_transactions():
    return transactions

@app.delete("/transactions/{tx_id}")
def delete_transaction(tx_id: int):
    global transactions
    
    transactions = [t for t in transactions if t.id != tx_id]
    return {"deleted_id": tx_id}

