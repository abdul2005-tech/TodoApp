import React from "react";

const Home = ({ todos, title, desc, setTitle, setDesc, addTodo, deltodo, updateTodo }) => {
  return (
    <div className="app-wrapper">
      <div className="card">
        <h1>FUTURE<span style={{color: 'var(--primary)'}}>LIST</span></h1>

        <div className="input-group">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Task Description"
          />
          <button onClick={addTodo}>Initialize Task</button>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p style={{textAlign: 'center', opacity: 0.4}}>No active sequences. Start by adding one.</p>
          ) : (
            todos.map(todo => (
              <div className="todo-item" key={todo.sno}>
                <div className="todo-text">
                  <h3>{todo.title}</h3>
                  <p>{todo.desc}</p>
                </div>
                <div className="btn-group">
                  <button className="update-btn" onClick={() => updateTodo(todo.sno)}>Edit</button>
                  <button className="delete-btn" onClick={() => deltodo(todo.sno)}>Dismiss</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;