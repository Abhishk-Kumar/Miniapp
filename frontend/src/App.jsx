import { useState } from "react";
import Login from "./components/Login";
import "./styles/global.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  return (
    <div>
      {loggedIn ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2> Logged in! </h2>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 24px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}