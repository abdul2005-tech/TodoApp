import React, { useState } from "react";

const Settings = () => {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:5000/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ old_password: oldPw, new_password: newPw })
    });

    if (res.ok) {
      alert("Security credentials updated.");
      setOldPw(""); setNewPw("");
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="card">
        <h1>USER <span style={{color: 'var(--primary)'}}>PROFILE</span></h1>
        <div style={{marginBottom: "30px", padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "10px"}}>
          <p style={{margin: 0, opacity: 0.6, fontSize: "12px"}}>CURRENTLY AUTHENTICATED AS</p>
          <h2 style={{margin: "5px 0 0 0", color: "var(--primary)"}}>Active User</h2>
        </div>

        <h3 style={{fontSize: "14px", letterSpacing: "1px", marginBottom: "15px"}}>CHANGE CREDENTIALS</h3>
        <form onSubmit={handleUpdate}>
          <input type="password" placeholder="Current Password" value={oldPw} onChange={(e)=>setOldPw(e.target.value)} required />
          <input type="password" placeholder="New Password" value={newPw} onChange={(e)=>setNewPw(e.target.value)} required />
          <button type="submit" className="main-action-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;