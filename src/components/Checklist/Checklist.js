import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import "./Checklist.css";

function Checklist() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim()) {
      const newTask = {
        id: uuidv4(),
        text: input.slice(0, 125),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInput("");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination || source.droppableId !== destination.droppableId)
        return;

      const unfinishedTasks = tasks.filter((t) => !t.completed);
      const finishedTasks = tasks.filter((t) => t.completed);
      let updatedTasks;

      if (source.droppableId === "unfinished") {
        const newUnfinished = Array.from(unfinishedTasks);
        const [movedTask] = newUnfinished.splice(source.index, 1);
        newUnfinished.splice(destination.index, 0, movedTask);
        updatedTasks = [...newUnfinished, ...finishedTasks];
      } else if (source.droppableId === "finished") {
        const newFinished = Array.from(finishedTasks);
        const [movedTask] = newFinished.splice(source.index, 1);
        newFinished.splice(destination.index, 0, movedTask);
        updatedTasks = [...unfinishedTasks, ...newFinished];
      }

      setTasks(updatedTasks);
    },
    [tasks]
  );

  const unfinishedTasks = tasks.filter((task) => !task.completed);
  const finishedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="checklist-page">
      <h2>Checklist</h2>
      <div className="add-task">
        <input
          type="text"
          placeholder="Add a task..."
          value={input}
          maxLength={125}
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
                <ul
                  className="tasks-list unfinished"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {unfinishedTasks.length === 0 ? (
                    <li className="empty">No tasks added.</li>
                  ) : (
                    unfinishedTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                          >
                            <span className="task-text">{task.text}</span>
                            <div className="task-actions">
                              <button
                                onClick={() => toggleTaskCompletion(task.id)}
                                className="btn finish-btn"
                              >
                                Finish
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="btn delete-btn"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
          <div className="column">
            <h3>Finished Tasks</h3>
            <Droppable droppableId="finished">
              {(provided) => (
                <ul
                  className="tasks-list finished"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {finishedTasks.length === 0 ? (
                    <li className="empty">No finished tasks.</li>
                  ) : (
                    finishedTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                          >
                            <span className="task-text">{task.text}</span>
                            <div className="task-actions">
                              <button
                                onClick={() => toggleTaskCompletion(task.id)}
                                className="btn reopen-btn"
                              >
                                Reopen
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="btn delete-btn"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default Checklist;
