import { useEffect, useState } from 'react';

const API = "http://127.0.0.1:8000";

export default function App() {
  const [transactions, setTransactions] = useState([]);


//form state
const [date, setDate] = useState('');
const [type, setType] = useState('Income');
const [category, setCategory] = useState('');
const [amount, setAmount] = useState('');
const [description, setDescription] = useState('');
const [filterType, setFilterType] = useState("All");


  async function loadTransactions() {
    const response = await fetch(`${API}/transactions`);
    const data = await response.json();
    setTransactions(data);
  }

  async function deleteTransaction(id) {
    try {
      const response = await fetch(`${API}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.detail || "Delete failed");
        return;
      }

      // update UI immediately
      setTransactions((prev) =>
        prev.filter((t) => t.id !== id)
      );
    } catch (e) {
      alert("Delete failed. Backend may not be running.");
    }
  }

  async function addTransaction() {
  // minimal frontend validation
  if (!date || !category || !description || !amount) {
    alert("Please fill in all fields");
    return;
  }

  const newTx = {
    date,
    type,
    category,
    description,
    amount: Number(amount),
  };

  const response = await fetch(`${API}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTx),
  });

  if (!response.ok) {
    const err = await response.json();
    alert(err.detail || "Failed to add transaction");
    return;
  }

  // clear inputs
  setDate("");
  setType("Income");
  setCategory("");
  setDescription("");
  setAmount("");

  loadTransactions();


}

  useEffect(() => {
    loadTransactions();
  }, []);
const totalIncome = transactions
  .filter((t) => t.type === "Income")
  .reduce((sum, t) => sum + t.amount, 0);

const totalExpense = transactions
  .filter((t) => t.type === "Expense")
  .reduce((sum, t) => sum + t.amount, 0);

const balance = totalIncome - totalExpense;

const filteredTransactions = transactions.filter((t) => {
  if (filterType === "All") return true;
  return t.type === filterType;
});

const sortedTransactions = [...filteredTransactions].sort(
  (a, b) => b.date.localeCompare(a.date)
);


const expenseByCategory = transactions
  .filter((t) => t.type === "Expense")
  .reduce((acc, t) => {
    const key = t.category || "Uncategorised";
    acc[key] = (acc[key] || 0) + t.amount;
    return acc;

  }, {});


  return (
  <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
    <h1>Budget tracker</h1>
    <p>
      <strong>Income:</strong> €{totalIncome.toFixed(2)} |{" "}
      <strong>Expense:</strong> €{totalExpense.toFixed(2)} |{" "}
      <strong>Balance:</strong> €{balance.toFixed(2)}
    </p>
    <h2>Spending by category</h2>
    
{Object.keys(expenseByCategory).length === 0 ? (
  <p>No expense data yet</p>
) : (
  <ul>
    {Object.entries(expenseByCategory).map(([cat, total]) => (
      <li key={cat}>
        {cat}: €{total.toFixed(2)}
      </li>
    ))}
  </ul>
)}


    <h2>Add transaction</h2>

    <div style={{ display: "grid", gap: 10 }}>
      <input
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      <input
        placeholder="Category (e.g. Food)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={addTransaction}>Add</button>
      <button onClick={loadTransactions}>Reload</button>
      
    </div>

    <hr style={{ margin: "20px 0" }} />

    <h2>Transactions</h2>
    <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
  <button
    type="button"
    onClick={() => setFilterType("All")}
    style={{ fontWeight: filterType === "All" ? "bold" : "normal" }}
  >
    All
  </button>

  <button
    type="button"
    onClick={() => setFilterType("Income")}
    style={{ fontWeight: filterType === "Income" ? "bold" : "normal" }}
  >
    Income
  </button>

  <button
    type="button"
    onClick={() => setFilterType("Expense")}
    style={{ fontWeight: filterType === "Expense" ? "bold" : "normal" }}
  >
    Expense
  </button>
</div>


    {transactions.length === 0 ? (
      <p>No transactions found</p>
    ) : (
      <ul>
        {sortedTransactions.map((transaction) => (

          <li
  key={transaction.id}
  style={{
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "8px 10px",
    marginBottom: 8,
    border: "1px solid #ddd",
    borderRadius: 8,
    background: transaction.type === "Income" ? "#2f7a2f" : "#702121",
  }}
>
  <div>
    <strong>{transaction.type}</strong> — {transaction.date}<br />
    {transaction.category} • {transaction.description}
  </div>
  

  <div style={{ textAlign: "right" }}>
    <strong>€{transaction.amount.toFixed(2)}</strong>
    <div>
      <button
        type="button"
        onClick={() => deleteTransaction(transaction.id)}
      >
        Delete
      </button>
    </div>
  </div>
</li>

        ))}
      </ul>
    )}
  </div>
);

}
