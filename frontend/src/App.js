import React, { useState } from "react";
import "./App.css";

function App() {
  const [address, setAddress] = useState("");
  const [tokenFilter, setTokenFilter] = useState("");
  const [excludeScam, setExcludeScam] = useState(false);
  const [toBlock, setToBlock] = useState("");
  const [result, setResult] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTokenBalances",
        params: [
          {
            address,
            excludeSpam: excludeScam,
            toBlock: toBlock ? parseInt(toBlock) : null,
          },
        ],
      }),
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_MORALIS_RPC_NODE_URL,
        options
      );
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="App">
      <h1>Moralis Extended RPC Demo</h1>
      <h3 style={{textAlign:"center"}}>RPC API: eth_getTokenBalances</h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Wallet Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your wallet address"
          />
        </div>
        <div className="form-group">
          <label>Filter Token Addresses:</label>
          <input
            type="text"
            value={tokenFilter}
            onChange={(e) => setTokenFilter(e.target.value)}
            placeholder="Add/Filter token addresses"
          />
        </div>
        <div className="form-group">
          <label>Exclude Scam Tokens:</label>
          <input
            type="checkbox"
            checked={excludeScam}
            onChange={(e) => setExcludeScam(e.target.checked)}
          />
        </div>
        <div className="form-group">
          <label>Query Until Block:</label>
          <input
            type="text"
            value={toBlock}
            onChange={(e) => setToBlock(e.target.value)}
            placeholder="Block number"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {result.length > 0 && (
  <div className="table-container">
    <table className="result-table">
      <thead>
        <tr>
          <th>Token Address</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Balance</th>
          <th>Verified</th>
          <th>Spam</th>
        </tr>
      </thead>
      <tbody>
        {result.map((token, index) => (
          <tr key={index}>
            <td>{token.token_address}</td>
            <td>
              <div className="token-info">
                <img src={token.logo} alt={token.symbol} className="token-logo" />
                <span>{token.name}</span>
              </div>
            </td>
            <td>{token.symbol}</td>
            <td>{token.balance}</td>
            <td>{token.verified_contract ? "Yes" : "No"}</td>
            <td>{token.possible_spam ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


    </div>
  );
}

export default App;
