import React, { useState, useEffect } from "react";
import "./App.css";

const API = "https://playground.4geeks.com/todo";
const USER = "Gemini"; 

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const createUser = async () => {
    try {
      const response = await fetch(`${API}/users/${USER}`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }
      
      console.log("User created successfully");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user");
    }
  };

  
  const fetchTodos = async () => {
    try {
      setError(null);
      const resp = await fetch(`${API}/users/${USER}`);
      
      if (resp.status === 404) {
        await createUser();
        return fetchTodos(); 
      }
      
      if (!resp.ok) {
        throw new Error(`Failed to fetch todos: ${resp.status}`);
      }
      
      const data = await resp.json();
      
      
      const userTodos = data.todos || [];
      setTodos(Array.isArray(userTodos) ? userTodos : []);
      
    } catch (err) {
      setTodos([]);
      setError("Failed to load todos");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    
    try {
      setError(null);
      const response = await fetch(`${API}/todos/${USER}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          label: input.trim(), 
          is_done: false 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add todo: ${response.status}`);
      }
      
      setInput("");
      await fetchTodos(); 
      
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      const response = await fetch(`${API}/todos/${id}`, { 
        method: "DELETE" 
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.status}`);
      }
      
      await fetchTodos(); // Refresh the list
      
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo");
    }
  };

  const clearAllTasks = async () => {
    try {
      setError(null);
      
      const deletePromises = todos.map(todo => 
        fetch(`${API}/todos/${todo.id}`, { method: "DELETE" })
      );
      
      await Promise.all(deletePromises);
      await fetchTodos(); 
      
    } catch (err) {
      console.error("Error clearing all todos:", err);
      setError("Failed to clear all todos");
    }
  };

  if (loading) {
    return (
      <div className="wrapper">
        <div className="todo-app">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="todo-app">
        <h1 className="header">todos</h1>
        {error && (
          <div className="error" style={{
            color: 'red', 
            padding: '10px', 
            marginBottom: '10px', 
            border: '1px solid red', 
            borderRadius: '4px',
            backgroundColor: '#ffebee'
          }}>
            {error}
          </div>
        )}
        <div className="todo-card">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a task"
          />
          <button className="add-btn" onClick={addTodo}>
            Add
          </button>
          <button
            className="clear-all"
            onClick={clearAllTasks}
            style={{ marginLeft: "8px" }}
            disabled={todos.length === 0}
          >
            Clear All
          </button>
          <div className="list">
            {todos.length === 0 ? (
              <div className="empty">No tasks, add a task</div>
            ) : (
              todos.map((todo) => (
                <div className="todo-row" key={todo.id}>
                  <span className={todo.is_done ? "completed" : ""}>
                    {todo.label}
                  </span>
                  <span
                    className="delete"
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete"
                    style={{ cursor: 'pointer' }}
                  >
                    &#x2715;
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="footer">
            {todos.length > 0 &&
              `${todos.length} item${todos.length > 1 ? "s" : ""} left`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;