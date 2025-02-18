import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Pomodoro.css";

function Pomodoro() {
  const defaultWorkTime = 25 * 60;
  const defaultBreakTime = 5 * 60;
  const [workTime, setWorkTime] = useState(defaultWorkTime);
  const [breakTime, setBreakTime] = useState(defaultBreakTime);
  const [timeLeft, setTimeLeft] = useState(defaultWorkTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const timerRef = useRef(null);

  // Calculate progress percentage for the progress bar and background fill
  const totalDuration = isWork ? workTime : breakTime;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      clearInterval(timerRef.current);
      if (isWork) {
        if (Notification.permission === "granted") {
          new Notification(
            "Work session ended! Break will start in 10 seconds."
          );
        }
        setIsRunning(false);
        setTimeout(() => {
          setIsWork(false);
          setTimeLeft(breakTime);
        }, 10000);
      } else {
        if (Notification.permission === "granted") {
          new Notification("Break ended! Resetting to work session.");
        }
        setIsRunning(false);
        setIsWork(true);
        setWorkTime(defaultWorkTime);
        setBreakTime(defaultBreakTime);
        setTimeLeft(defaultWorkTime);
      }
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [
    isRunning,
    timeLeft,
    isWork,
    breakTime,
    defaultWorkTime,
    defaultBreakTime,
  ]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleStartPause = () => {
    if (!isRunning && timeLeft === 0) {
      setTimeLeft(isWork ? workTime : breakTime);
    }
    setIsRunning((prev) => !prev);
  };

  const handleCancel = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTimeLeft(isWork ? workTime : breakTime);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  const handleTimeChange = (e, type) => {
    const value = Math.max(
      1,
      Math.min(60, parseInt(e.target.value, 10) || (type === "work" ? 25 : 5))
    );
    if (type === "work") {
      setWorkTime(value * 60);
      if (!isRunning && isWork) {
        setTimeLeft(value * 60);
      }
    } else {
      setBreakTime(value * 60);
      if (!isRunning && !isWork) {
        setTimeLeft(value * 60);
      }
    }
  };

  const handleWorkFocus = () => {
    if (!isRunning) {
      setIsWork(true);
      setTimeLeft(workTime);
    }
  };

  const handleBreakFocus = () => {
    if (!isRunning) {
      setIsWork(false);
      setTimeLeft(breakTime);
    }
  };

  return (
    <div className="pomodoro">
      <h1 className="pomodoro-title">Pomodoro Timer</h1>

      {/* Full-Page Water Animation Background (placed behind the card) */}
      <motion.div
        className={`page-background ${isWork ? "work" : "break"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Water Fill Animation within the Pomodoro Card */}
      <motion.div
        className={`water-animation ${isWork ? "work" : "break"}`}
        initial={{ height: "100%" }}
        animate={{ height: isRunning ? `${progressPercent}%` : "100%" }}
        transition={{ duration: 0.5 }}
      />

      <div className="timer-display">
        <span className={isWork ? "work-time" : "break-time"}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Existing Progressive Bar */}
      <motion.div
        className={`progress-bar ${isWork ? "work" : "break"}`}
        style={{ width: `${progressPercent}%` }}
        transition={{ duration: 0.5 }}
      />

      <div className="controls">
        <button onClick={handleStartPause} className="start-pause-btn">
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
      </div>

      {/* Custom Time Panel (fades out when timer is running) */}
      <AnimatePresence>
        {!isRunning && (
          <motion.div
            className="custom-time"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <label className="work-time">Work Time (min): </label>
              <input
                type="number"
                value={(workTime / 60).toFixed(0)}
                onChange={(e) => handleTimeChange(e, "work")}
                onFocus={handleWorkFocus}
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="break-time">Break Time (min): </label>
              <input
                type="number"
                value={(breakTime / 60).toFixed(0)}
                onChange={(e) => handleTimeChange(e, "break")}
                onFocus={handleBreakFocus}
                min="1"
                max="60"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Pomodoro;
