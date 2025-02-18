import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import "./Checklist.css";

function Checklist() {
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim()) {
      const newTask = {
        id: uuidv4(),
        text: input.slice(0, 80),
      };
      setUnfinishedTasks((prev) => [...prev, newTask]);
      setInput("");
    }
  };

  const deleteTask = (id, isUnfinished) => {
    const newUnfinished = isUnfinished
      ? unfinishedTasks.filter((t) => t.id !== id)
      : finishedTasks.filter((t) => t.id !== id);
    const newFinished = isUnfinished
      ? finishedTasks
      : finishedTasks.filter((t) => t.id !== id);
    setUnfinishedTasks(newUnfinished);
    setFinishedTasks(newFinished);
  };

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;

      const sourceIndex = source.index;
      const destIndex = destination.index;
      const sourceDroppable = source.droppableId;
      const destDroppable = destination.droppableId;

      if (sourceDroppable === destDroppable) {
        // Reordering within the same column
        const isUnfinished = sourceDroppable === "unfinished";
        const currentArray = isUnfinished ? unfinishedTasks : finishedTasks;
        const newCurrentArray = [...currentArray];
        const [movedTask] = newCurrentArray.splice(sourceIndex, 1);
        newCurrentArray.splice(destIndex, 0, movedTask);
        if (isUnfinished) {
          setUnfinishedTasks(newCurrentArray);
        } else {
          setFinishedTasks(newCurrentArray);
        }
      } else {
        // Moving between columns
        const sourceArray =
          sourceDroppable === "unfinished" ? unfinishedTasks : finishedTasks;
        const destinationArray =
          destDroppable === "unfinished" ? unfinishedTasks : finishedTasks;

        const [movedTask] = sourceArray.splice(sourceIndex, 1);
        destinationArray.splice(destIndex, 0, movedTask);
      }
    },
    [unfinishedTasks, finishedTasks]
  );

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
                              onClick={() => deleteTask(task.id, true)}
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
                              onClick={() => deleteTask(task.id, false)}
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
