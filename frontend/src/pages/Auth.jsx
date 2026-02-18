import React, { useState } from "react";
const API = import.meta.env.VITE_API_URL;
const Auth = ({ fetchTodos }) => {
  const [mode, setMode] = useState("login"); // "login", "register", or "forgot"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let endpoint = mode === "login" ? "login" : mode === "register" ? "register" : "reset-password";
    
    const res = await fetch(`${API}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: password, new_password: password })
    });

    const data = await res.json();
    if (res.ok) {
      if (mode === "login") {
        localStorage.setItem("token", data.token);
        fetchTodos();
      } else {
        alert(mode === "register" ? "Registered successfully!" : "Password reset successfully!");
        setMode("login");
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{mode === "login" ? "Login" : mode === "register" ? "Register" : "Reset PW"}</h1>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
          <input placeholder="Username" onChange={(e)=>setUsername(e.target.value)} required />
          <input type="password" placeholder={mode === "forgot" ? "New Password" : "Password"} 
                 onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" className="main-action-btn">
            {mode === "login" ? "Access System" : mode === "register" ? "Create Identity" : "Update Password"}
          </button>
        </form>
        
        <div style={{marginTop: "15px", textAlign: "center", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px"}}>
          <span className="link-text" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Need an account? Register" : "Back to Login"}
          </span>
          {mode === "login" && (
            <span className="link-text" style={{opacity: 0.5}} onClick={() => setMode("forgot")}>
              Forgot Password?
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;