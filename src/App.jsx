import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import About from "./pages/About";

const App = () => {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const fetchdata = async () => {
      const api = await fetch("http://127.0.0.1:5000/todos");
      const data = await api.json();
      setTodos(data);
    };
    fetchdata();
  }, []);

  const addTodo = async () => {
    await fetch("http://127.0.0.1:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, desc })
    });

    const res = await fetch("http://127.0.0.1:5000/todos");
    const data = await res.json();
    setTodos(data);
    setTitle("");
    setDesc("");
  };

  const deltodo = async (sno) => {
    await fetch(`http://127.0.0.1:5000/todos/${sno}`, {
      method: "DELETE"
    });

    const res = await fetch("http://127.0.0.1:5000/todos");
    const data = await res.json();
    setTodos(data);
  };

  const updateTodo = async (sno) => {
    const newTitle = prompt("Enter new title:");
    if (!newTitle) return;

    await fetch(`http://127.0.0.1:5000/todos/${sno}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: newTitle })
    });

    const res = await fetch("http://127.0.0.1:5000/todos");
    const data = await res.json();
    setTodos(data);
  };

  return (
    <>
      <Navbar />

      <Routes>
        <Route 
          path="/" 
          element={
            <Home
              todos={todos}
              title={title}
              desc={desc}
              setTitle={setTitle}
              setDesc={setDesc}
              addTodo={addTodo}
              deltodo={deltodo}
              updateTodo={updateTodo}
            />
          } 
        />

        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
