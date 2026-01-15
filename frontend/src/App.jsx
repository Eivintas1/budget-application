import { useEffect, useState } from 'react';

const API = "http://127.0.0.1:8000";

export default function App() {
  const [transactions, setTransactions] = useState([]);

  async function loadTransactions() {
    const response = await fetch(`${API}/transactions`);
    const data = await response.json();
    setTransactions(data);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div style={{padding: 20}}>
      <h1>Budget tracker</h1>

      <button onClick={loadTransactions}>Reload</button>

      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.date} - {transaction.type} - {transaction.catagory} - ${transaction.amount} - {transaction.description}
          </li>
        ))}
        </ul>
      )}
    </div>
  );
}