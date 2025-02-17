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
        text: input.slice(0, 80),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInput("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;

      const sourceIndex = source.index;
      const destIndex = destination.index;
      const sourceDroppable = source.droppableId;
      const destDroppable = destination.droppableId;

      const newTasks = [...tasks];

      if (sourceDroppable === destDroppable) {
        // Reordering within the same column
        const [movedTask] = newTasks.splice(sourceIndex, 1);
        newTasks.splice(destIndex, 0, movedTask);
        setTasks(newTasks);
      } else {
        // Moving between columns: update completed status
        const sourceArray =
          sourceDroppable === "unfinished"
            ? tasks.filter((t) => !t.completed)
            : tasks.filter((t) => t.completed);

        const destinationArray =
          destDroppable === "unfinished"
            ? tasks.filter((t) => !t.completed)
            : tasks.filter((t) => t.completed);

        const [movedTask] = sourceArray.splice(sourceIndex, 1);
        movedTask.completed = destDroppable === "unfinished" ? false : true;

        // Insert into destination array at correct index
        const newDestinationArray = [
          ...destinationArray.slice(0, destIndex),
          movedTask,
          ...destinationArray.slice(destIndex),
        ];

        // Reconstruct tasks array
        setTasks([...newDestinationArray, ...sourceArray]);
      }
    },
    [tasks]
  );

  const unfinishedTasks = tasks.filter((t) => !t.completed);
  const finishedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="checklist-page">
      <h2>Checklist</h2>
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
                <ul
                  className="tasks-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {unfinishedTasks.map((task, index) => (
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
                              onClick={() => deleteTask(task.id)}
                              className="btn delete-btn"
                            >
                              Delete
                            </button>
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
                <ul
                  className="tasks-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {finishedTasks.map((task, index) => (
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
                              onClick={() => deleteTask(task.id)}
                              className="btn delete-btn"
                            >
                              Delete
                            </button>
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
    </div>
  );
}

export default Checklist;
