import React, { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import "./Checklist.css";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}": `, error);
      return initialValue;
    }
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}": `, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

function Checklist() {
  const { user, loading } = useOutletContext();
  const [unfinishedTasks, setUnfinishedTasks] = useLocalStorage(
    "checklist_unfinishedTasks",
    []
  );
  const [finishedTasks, setFinishedTasks] = useLocalStorage(
    "checklist_finishedTasks",
    []
  );
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim()) {
      const newTask = { id: uuidv4(), text: input.slice(0, 80) };
      setUnfinishedTasks((prev) => [...prev, newTask]);
      setInput("");
    }
  };

  const deleteTask = (id, isUnfinished) => {
    if (isUnfinished) {
      setUnfinishedTasks(unfinishedTasks.filter((t) => t.id !== id));
    } else {
      setFinishedTasks(finishedTasks.filter((t) => t.id !== id));
    }
  };

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      const startList = source.droppableId === "unfinished" ? [...unfinishedTasks] : [...finishedTasks];
      const endList = destination.droppableId === "unfinished" ? [...unfinishedTasks] : [...finishedTasks];
      const [movedTask] = startList.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        startList.splice(destination.index, 0, movedTask);
        if (source.droppableId === "unfinished") {
          setUnfinishedTasks(startList);
        } else {
          setFinishedTasks(startList);
        }
      } else {
        endList.splice(destination.index, 0, movedTask);
        if (source.droppableId === "unfinished") {
          setUnfinishedTasks(startList);
          setFinishedTasks(endList);
        } else {
          setFinishedTasks(startList);
          setUnfinishedTasks(endList);
        }
      }
    },
    [unfinishedTasks, finishedTasks, setUnfinishedTasks, setFinishedTasks]
  );

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="checklist-page">
      <h2>Checklist</h2>
      {user ? (
        <>
          <div className="add-task">
            <input
              type="text"
              placeholder="Add a task..."
              value={input}
              maxLength={80}
              onChange={(e) => setInput(e.target.value)}
              className="add-task-input"
            />
            <button onClick={addTask} className="add-task-btn">
              Add
            </button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="columns">
              <div className="column">
                <h3>Unfinished Tasks</h3>
                <Droppable droppableId="unfinished">
                  {(provided) => (
                    <ul className="tasks-list" ref={provided.innerRef} {...provided.droppableProps}>
                      {unfinishedTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-item">
                              <span className="task-text">{task.text}</span>
                              <div className="task-actions">
                                <button onClick={() => deleteTask(task.id, true)} className="btn delete-btn">Delete</button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
              <div className="column">
                <h3>Finished Tasks</h3>
                <Droppable droppableId="finished">
                  {(provided) => (
                    <ul className="tasks-list" ref={provided.innerRef} {...provided.droppableProps}>
                      {finishedTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-item">
                              <span className="task-text completed">{task.text}</span>
                              <div className="task-actions">
                                <button onClick={() => deleteTask(task.id, false)} className="btn delete-btn">Delete</button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        </>
      ) : (
        <div className="feature-locked">
          <h2>Sign in to access your Checklist</h2>
          <p>Please sign in to create, save, and manage your tasks.</p>
        </div>
      )}
    </div>
  );
}

export default Checklist;