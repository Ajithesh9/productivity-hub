import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../../firebase"; // Import Firestore
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import "./Checklist.css";

function Checklist() {
  const { user, loading } = useOutletContext();
  // State is now managed by Firestore
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [input, setInput] = useState("");

  // Effect to fetch tasks from Firestore in real-time
  useEffect(() => {
    if (!user) {
      setUnfinishedTasks([]);
      setFinishedTasks([]);
      return;
    }

    // Query for tasks, ordered by their creation time
    const q = query(collection(db, "users", user.uid, "tasks"), orderBy("createdAt"));

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUnfinishedTasks(tasks.filter(task => !task.isFinished));
      setFinishedTasks(tasks.filter(task => task.isFinished));
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (input.trim()) {
      await addDoc(collection(db, "users", user.uid, "tasks"), {
        text: input.slice(0, 80),
        isFinished: false,
        createdAt: new Date(),
      });
      setInput("");
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  };

  const onDragEnd = useCallback(
    async (result) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;

      // If moving to the other column, update the task's status in Firestore
      if (source.droppableId !== destination.droppableId) {
        await updateDoc(doc(db, "users", user.uid, "tasks", draggableId), {
          isFinished: destination.droppableId === 'finished'
        });
      }
      // Note: For simplicity, this example doesn't handle reordering within a list.
      // That would require adding an 'order' field to the Firestore documents.
    },
    [user]
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
                                <button onClick={() => deleteTask(task.id)} className="btn delete-btn">Delete</button>
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
                                <button onClick={() => deleteTask(task.id)} className="btn delete-btn">Delete</button>
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