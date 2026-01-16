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

  async function loadTransactions() {
    const response = await fetch(`${API}/transactions`);
    const data = await response.json();
    setTransactions(data);
  }

  async function addTransaction() {
  const newTx = {
    date,
    type,
    category,
    description,
    amount: Number(amount),
  };

  const response = await fetch(`${API}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTx),
  });

  if (!response.ok) {
    const err = await response.json();
    alert(err.detail || 'Failed to add transaction');
    return;
  }

  //clear inputs
  setDate('');
  setType('Income');
  setCategory('');
  setAmount('');
  setDescription('');

  loadTransactions();
}
  

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
  <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
    <h1>Budget tracker</h1>

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
    {transactions.length === 0 ? (
      <p>No transactions found</p>
    ) : (
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.type} - {transaction.category} - €
            {transaction.amount} - {transaction.description}
          </li>
        ))}
      </ul>
    )}
  </div>
);

}
