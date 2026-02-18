import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Settings from "./pages/Settings";
const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchTodos = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://127.0.0.1:5000/todos", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setTodos(data);
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const addTodo = async () => {
    await fetch("http://127.0.0.1:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ title, desc })
    });
    setTitle(""); setDesc("");
    fetchTodos();
  };

  const deltodo = async (id) => {
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    fetchTodos();
  };

  const saveUpdate = async (id, updatedData) => {
    await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(updatedData)
    });
    setEditingTodo(null);
    fetchTodos();
  };

  return (
    <>
      <Navbar />
      <Routes>
      {/* Route for Home and Auth */}
      <Route path="/" element={
        localStorage.getItem("token") ? (
          <Home 
            todos={todos} title={title} desc={desc} 
            setTitle={setTitle} setDesc={setDesc} 
            addTodo={addTodo} deltodo={deltodo} 
            setEditingTodo={setEditingTodo}
            editingTodo={editingTodo}
            saveUpdate={saveUpdate}
          />
        ) : ( <Auth fetchTodos={fetchTodos} /> )
      } />

      {/* 2. Dedicated Route for About (Keep this outside the Home logic) */}
      <Route path="/about" element={<About />} />
      <Route path="/settings" element={localStorage.getItem("token") ? <Settings /> : <Auth />} />
    </Routes>
    </>
  );
};

export default App;