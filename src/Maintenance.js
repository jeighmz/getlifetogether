// Step 1: Import necessary hooks and components
import React, { useState, useEffect } from "react";
import Checkpoint from "./Checkpoint";
import { TailSpin } from 'react-loader-spinner';
import "./Maintenance.css"; // Assuming you will add your styles here

const Maintenance = () => {
  const [isLoading, setIsLoading] = useState(true); // State to control loading screen visibility
  const initialTasks = [
    {
      id: 1,
      checkpoint: "Morning Checkpoints",
      tasks: [
        {
          id: 1,
          name: "Make your bed and open the curtains.",
          points: 5,
          completed: false,
        },
        {
          id: 2,
          name: "Wipe down the sink, clean the mirror, ensure the toilet is clean.",
          points: 10,
          completed: false,
        },
      ],
      startHour: 6, // Morning starts at 6 AM
    },
    {
      id: 2,
      checkpoint: "Midday Checkpoints",
      tasks: [
        {
          id: 3,
          name: "Clear off clutter from tables, countertops, and desks.",
          points: 10,
          completed: false,
        },
        {
          id: 4,
          name: "Wash dishes or load the dishwasher, wipe down kitchen surfaces.",
          points: 15,
          completed: false,
        },
        {
          id: 5,
          name: "Empty small trash bins, take out the trash if full.",
          points: 5,
          completed: false,
        },
      ],
      startHour: 12, // Midday starts at 12 PM
    },
    {
      id: 3,
      checkpoint: "Evening Checkpoints",
      tasks: [
        {
          id: 6,
          name: "Fluff cushions, fold blankets, tidy up scattered items.",
          points: 10,
          completed: false,
        },
        {
          id: 7,
          name: "Wipe down countertops and appliances, sweep/vacuum the kitchen floor.",
          points: 15,
          completed: false,
        },
        {
          id: 8,
          name: "Hang up towels, quick wipe down of the shower/tub area.",
          points: 5,
          completed: false,
        },
        {
          id: 9,
          name: "Put dirty clothes in the hamper, fold and put away clean clothes.",
          points: 10,
          completed: false,
        },
      ],
      startHour: 17, // Evening starts at 5 PM
    },
    {
      id: 4,
      checkpoint: "Before Bed Checkpoints",
      tasks: [
        {
          id: 10,
          name: "Ensure all doors and windows are locked.",
          points: 5,
          completed: false,
        },
        {
          id: 11,
          name: "Walk through the apartment to ensure everything is in place.",
          points: 10,
          completed: false,
        },
        {
          id: 12,
          name: "Prepare items needed for the next day, review your calendar or to-do list.",
          points: 5,
          completed: false,
        },
      ],
      startHour: 21, // Before Bed starts at 9 PM
    },
  ];

  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem("maintenanceTasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  };

  const [tasks, setTasks] = useState(loadTasksFromLocalStorage());
  const [score, setScore] = useState(0);

  const totalPoints = initialTasks
    .flatMap((checkpoint) => checkpoint.tasks)
    .reduce((sum, task) => sum + task.points, 0);

  useEffect(() => {
    const calculateInitialScore = () => {
      return tasks
        .flatMap((checkpoint) => checkpoint.tasks)
        .filter((task) => task.completed)
        .reduce((sum, task) => sum + task.points, 0);
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Hide after 2 seconds

    const interval = setInterval(() => {
      setTasks(initialTasks);
      setScore(0); // Reset score every 24 hours
      localStorage.removeItem("maintenanceTasks"); // Clear saved tasks every 24 hours
    }, 86400000); // Reset tasks and score every 24 hours

    setScore(calculateInitialScore());

    return () => {
      clearTimeout(timer); // Cleanup timeout
      clearInterval(interval); // Cleanup interval
    };
  }, []);

  // Conditional rendering for the loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <TailSpin color="#00d1b2" height={80} width={80} />
        <p className="tron-text">Entering the Grid...</p>
      </div>
    );
  }

  const saveTasksToLocalStorage = (updatedTasks) => {
    localStorage.setItem("maintenanceTasks", JSON.stringify(updatedTasks));
  };

  const clearLocalStorageAndResetTasks = () => {
    localStorage.removeItem("maintenanceTasks"); // Clear local storage
    setTasks(initialTasks); // Reset tasks to initial state
    setScore(0); // Reset score to 0
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((checkpoint) => ({
      ...checkpoint,
      tasks: checkpoint.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));

    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);

    const task = tasks
      .flatMap((checkpoint) => checkpoint.tasks)
      .find((task) => task.id === taskId);

    setScore((prevScore) =>
      task.completed ? prevScore - task.points : prevScore + task.points
    );
  };

  const getCurrentHour = () => new Date().getHours();
  const getProgressPercentage = () => {
    const totalPoints = initialTasks
      .flatMap((checkpoint) => checkpoint.tasks)
      .reduce((sum, task) => sum + task.points, 0);
    return (score / totalPoints) * 100;
  };

  return (
    <div>
      <h1>DwellWell Daily</h1>
      <h2>Score: {score} points</h2>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      {tasks
        .filter((checkpoint) => getCurrentHour() >= checkpoint.startHour)
        .map((checkpoint) => (
          <Checkpoint
            key={checkpoint.id}
            checkpoint={checkpoint}
            onToggle={toggleTaskCompletion}
          />
        ))}
      <button onClick={clearLocalStorageAndResetTasks}>Clear Tasks</button>{" "}
      {/* This is the new button */}
    </div>
  );
};

export default Maintenance;
