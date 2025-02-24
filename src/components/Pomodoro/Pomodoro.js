import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Pomodoro.css";

// Import alarm audio files from assets
import workAlarm from "../../assets/Work-Alarm-trigger.mp3";
import breakStart from "../../assets/Break-time-start.mp3";

// Custom hook for localStorage persistence
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

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}": `, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

function Pomodoro() {
  const defaultWorkTime = 25 * 60;
  const defaultBreakTime = 5 * 60;

  // Persist state using localStorage
  const [workTime, setWorkTime] = useLocalStorage(
    "pomodoro_workTime",
    defaultWorkTime
  );
  const [breakTime, setBreakTime] = useLocalStorage(
    "pomodoro_breakTime",
    defaultBreakTime
  );
  const [timeLeft, setTimeLeft] = useLocalStorage(
    "pomodoro_timeLeft",
    defaultWorkTime
  );
  const [isRunning, setIsRunning] = useLocalStorage(
    "pomodoro_isRunning",
    false
  );
  const [isWork, setIsWork] = useLocalStorage("pomodoro_isWork", true);
  const [startTimestamp, setStartTimestamp] = useLocalStorage(
    "pomodoro_startTimestamp",
    null
  );
  const timerRef = useRef(null);

  // On mount, if the timer was running, calculate elapsed time while unmounted.
  // This effect is intentionally run only once.
  useEffect(() => {
    if (isRunning && startTimestamp) {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      if (elapsed > 0) {
        setTimeLeft((prev) => Math.max(prev - elapsed, 0));
        // Reset startTimestamp to now for continued accuracy.
        setStartTimestamp(Date.now());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const totalDuration = isWork ? workTime : breakTime;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      clearInterval(timerRef.current);
      if (isWork) {
        // Play work alarm sound when work session ends
        const alarm = new Audio(workAlarm);
        alarm.volume = 0.35;
        alarm.play();

        if (Notification.permission === "granted") {
          new Notification(
            "Work session ended! Break will start in 10 seconds."
          );
        }
        setIsRunning(false);
        // After 10 seconds, automatically start the break session.
        setTimeout(() => {
          setIsWork(false);
          setTimeLeft(breakTime);
          setStartTimestamp(Date.now());
          setIsRunning(true);
          // Play break start sound when break session begins
          const breakSound = new Audio(breakStart);
          breakSound.volume = 0.35;
          breakSound.play();
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
        setStartTimestamp(null);
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
    setTimeLeft,
    setIsRunning,
    setIsWork,
    setWorkTime,
    setBreakTime,
    setStartTimestamp,
  ]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleStartPause = () => {
    if (!isRunning) {
      if (timeLeft === 0) {
        setTimeLeft(isWork ? workTime : breakTime);
      }
      setIsRunning(true);
      setStartTimestamp(Date.now());
    } else {
      setIsRunning(false);
      setStartTimestamp(null);
    }
  };

  const handleCancel = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTimeLeft(isWork ? workTime : breakTime);
    setStartTimestamp(null);
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

  // Determine button text: "Pause" if running; if paused and timeLeft < total, "Resume"; else "Start"
  const startButtonText = isRunning
    ? "Pause"
    : timeLeft < (isWork ? workTime : breakTime)
    ? "Resume"
    : "Start";

  return (
    <div className="pomodoro">
      <h1 className="pomodoro-title">Pomodoro Timer</h1>
      <motion.div
        className={`page-background ${isWork ? "work" : "break"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className={`water-animation ${isWork ? "work" : "break"}`}
        initial={{ height: isWork ? "120%" : "100%" }}
        animate={{
          height: isRunning
            ? isWork
              ? `${progressPercent * 1.2}%`
              : `${progressPercent}%`
            : isWork
            ? "120%"
            : "100%",
        }}
        transition={{ duration: 0.5 }}
      />
      <div className="timer-display">
        <span className={isWork ? "work-time" : "break-time"}>
          {formatTime(timeLeft)}
        </span>
      </div>
      <motion.div
        className={`progress-bar ${isWork ? "work" : "break"}`}
        style={{ width: `${progressPercent}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className="controls">
        <button onClick={handleStartPause} className="start-pause-btn">
          {startButtonText}
        </button>
        <button onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
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
