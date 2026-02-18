import React, { useState } from "react";

const EditModal = ({ todo, onSave, onCancel }) => {
  const [etitle, setEtitle] = useState(todo.title);
  const [edesc, setEdesc] = useState(todo.desc);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{color: 'var(--primary)', marginBottom: '20px'}}>Update Sequence</h2>
        <input value={etitle} onChange={(e) => setEtitle(e.target.value)} placeholder="Title" />
        <textarea 
          className="custom-textarea" 
          value={edesc} 
          onChange={(e) => setEdesc(e.target.value)} 
          rows="5"
          placeholder="Description"
        />
        <div style={{display: 'flex', gap: '10px'}}>
          <button className="main-action-btn" onClick={() => onSave(todo.id, {title: etitle, desc: edesc})}>Save</button>
          <button className="delete-btn" onClick={onCancel} style={{width: '100px'}}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Home = ({ todos, title, desc, setTitle, setDesc, addTodo, deltodo, setEditingTodo, editingTodo, saveUpdate }) => {
  return (
    <div className="app-wrapper">
      <div className="card">
        <h1>CORE<span style={{color: 'var(--primary)'}}>TASKS</span></h1>
        
        <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="input-group">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" required />
          <textarea 
            className="custom-textarea" 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
            placeholder="Objective Description (Enter for new lines)" 
            required
            rows="3"
          />
          <button type="submit" className="main-action-btn">Initialize Sequence</button>
        </form>

        <div className="todo-list">
          {todos.map(todo => (
            <div className="todo-item" key={todo.id}>
              <div className="todo-text">
                <h3>{todo.title}</h3>
                <p>{todo.desc}</p>
              </div>
              <div className="btn-group">
                <button className="update-btn" onClick={() => setEditingTodo(todo)}>Edit</button>
                <button className="delete-btn" onClick={() => deltodo(todo.id)}>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingTodo && (
        <EditModal 
          todo={editingTodo} 
          onSave={saveUpdate} 
          onCancel={() => setEditingTodo(null)} 
        />
      )}
    </div>
  );
};

export default Home;