import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import AddTask from "./components/AddTask";
import Tasks from "./components/Tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const getTask = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };

    getTask();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:8000/tasks");
    const tasks = await res.json();
    return tasks;
  };

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:8000/tasks/${id}`);
    const tasks = await res.json();
    return tasks;
  };

  const addTask = async (task) => {
    const res = await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    const data = await res.json();

    setTasks([...tasks, data]);
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    const data = await res.json();
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          showAdd={showAddTask}
          onAdd={() => setShowAddTask(!showAddTask)}
        />

        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}{" "}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onToggle={toggleReminder}
                  onDelete={deleteTask}
                />
              ) : (
                "No Task To Show"
              )}{" "}
            </>
          )}
        />

        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
