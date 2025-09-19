import React, { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Adds a new todo if input is not empty
  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([...todos, input.trim()]);
      setInput("");
    }
  };

  // Handles Enter key for adding todos
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  // Deletes a todo by index
  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-app">
      <h1 className="header">todos</h1>
      <div className="todo-card">
        <input
          className="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task"
        />
        <button className="add-btn" onClick={addTodo}>Add</button>
        <div className="list">
          {todos.length === 0 ? (
            <div className="empty">No tasks, add a task</div>
          ) : (
            todos.map((todo, i) => (
              <div className="todo-row" key={i}>
                {todo}
                <span
                  className="delete"
                  onClick={() => deleteTodo(i)}
                  title="Delete"
                >
                  &#x2715;
                </span>
              </div>
            ))
          )}
        </div>
        <div className="footer">
          {todos.length > 0 && `${todos.length} item${todos.length > 1 ? "s" : ""} left`}
        </div>
      </div>
    </div>
  );
}

export default Home;