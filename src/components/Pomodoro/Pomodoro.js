import React, { useState, useEffect, useRef } from "react";
import "./Pomodoro.css";

function Pomodoro() {
  // Defaults: 25 minutes work, 5 minutes break (in seconds)
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const timerRef = useRef(null);

  // Update timeLeft if workTime changes on a work session.
  useEffect(() => {
    if (isWork) {
      setTimeLeft(workTime);
    }
  }, [workTime, isWork]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Send a notification when the timer finishes
            if (Notification.permission === "granted") {
              new Notification(
                isWork
                  ? "Work session ended! Time for a break."
                  : "Break ended! Time to work."
              );
            }
            // Switch sessions
            if (isWork) {
              setIsWork(false);
              return breakTime;
            } else {
              setIsWork(true);
              return workTime;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isWork, workTime, breakTime]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const handleWorkTimeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setWorkTime(value * 60);
    }
  };

  const handleBreakTimeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setBreakTime(value * 60);
    }
  };

  return (
    <div className="pomodoro">
      <h1 className="pomodoro-title">Pomodoro Timer</h1>
      <div className="timer-display">
        <span>{formatTime(timeLeft)}</span>
      </div>
      <div className="controls">
        <button onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>
      <div className="custom-time">
        <div>
          <label>Work Time (min): </label>
          <input
            type="number"
            defaultValue="25"
            onBlur={handleWorkTimeChange}
          />
        </div>
        <div>
          <label>Break Time (min): </label>
          <input
            type="number"
            defaultValue="5"
            onBlur={handleBreakTimeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
