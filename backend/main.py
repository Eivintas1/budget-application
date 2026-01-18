from wsgiref.validate import validator
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# What the user SENDS (no id)
class TransactionIn(BaseModel):
    date: str = Field(..., min_length=1)
    type: Literal["Income", "Expense"]
    category: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)

    @validator("date")
    def validate_date(cls, value):
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return value

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

