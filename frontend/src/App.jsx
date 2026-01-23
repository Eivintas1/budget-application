import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [transactions, setTransactions] = useState([]);

  // form state
  const [date, setDate] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
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

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert("Delete failed. Backend may not be running.");
    }
  }

  async function addTransaction() {
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

    setDate("");
    setType("Income");
    setCategory("");
    setAmount("");
    setDescription("");

    loadTransactions();
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  // derived totals
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // derived category totals
  const expenseByCategory = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => {
      const key = t.category || "Uncategorised";
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {});

  // derived filter + sort
  const filteredTransactions = transactions.filter((t) => {
    if (filterType === "All") return true;
    return t.type === filterType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">
          <div className="logoDot" />
          <div>
            <h1 className="title" style={{ margin: 0 }}>
              Budget tracker
            </h1>
            <p className="subtitle">Track income, expenses, and your balance.</p>
          </div>
        </div>

        <button type="button" className="primary" onClick={loadTransactions}>
          Reload
        </button>
      </div>

      <div className="totals">
        <div className="pill">Income: €{totalIncome.toFixed(2)}</div>
        <div className="pill">Expense: €{totalExpense.toFixed(2)}</div>
        <div className="pill">Balance: €{balance.toFixed(2)}</div>
      </div>

      <div className="layout" style={{ marginTop: 14 }}>
        {/* LEFT COLUMN */}
        <div className="card">
          <h2 className="sectionTitle">Add transaction</h2>

          <div className="grid">
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
          </div>

          <div className="actions">
            <button type="button" className="primary" onClick={addTransaction}>
              Add
            </button>
          </div>

          <h2 className="sectionTitle" style={{ marginTop: 18 }}>
            Spending by category
          </h2>

          {Object.keys(expenseByCategory).length === 0 ? (
            <div className="empty">No expense data yet.</div>
          ) : (
            <ul className="list">
              {Object.entries(expenseByCategory).map(([cat, total]) => (
                <li key={cat} className="tx">
                  <div>
                    <div>
                      <strong>{cat}</strong>
                    </div>
                    <div className="txMeta">Total</div>
                  </div>
                  <div className="amount">€{total.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="card">
          <div className="txHeader">
            <h2 className="sectionTitle" style={{ margin: 0 }}>
              Transactions
            </h2>

            <div className="filterRow" style={{ margin: 0 }}>
              <button
                type="button"
                onClick={() => setFilterType("All")}
                className={filterType === "All" ? "pillBtn active" : "pillBtn"}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setFilterType("Income")}
                className={
                  filterType === "Income" ? "pillBtn active" : "pillBtn"
                }
              >
                Income
              </button>

              <button
                type="button"
                onClick={() => setFilterType("Expense")}
                className={
                  filterType === "Expense" ? "pillBtn active" : "pillBtn"
                }
              >
                Expense
              </button>
            </div>
          </div>

          {sortedTransactions.length === 0 ? (
            <div className="empty" style={{ marginTop: 12 }}>
              No transactions yet — add your first one on the left.
            </div>
          ) : (
            <ul className="list">
              {sortedTransactions.map((t) => (
                <li
                  key={t.id}
                  className={`tx ${t.type === "Income" ? "income" : "expense"}`}
                >
                  <div>
                    <div>
                      <strong>{t.category}</strong> • {t.description}
                    </div>
                    <div className="txMeta">
                      {t.type} • {t.date}
                    </div>
                  </div>

                  <div>
                    <div className="amount">€{t.amount.toFixed(2)}</div>
                    <button
                      type="button"
                      className="smallBtn"
                      onClick={() => deleteTransaction(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
