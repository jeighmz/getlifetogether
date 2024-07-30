import React, { useState, useEffect } from 'react';
import Checkpoint from './Checkpoint';

const Hygiene = () => {
  const initialTasks = [
    {
      id: 1,
      checkpoint: 'Morning Routine',
      tasks: [
        { id: 1, name: 'Brush your teeth.', points: 5, completed: false },
        { id: 2, name: 'Wash your face.', points: 5, completed: false },
        { id: 3, name: 'Run.', points: 15, completed: false },
      ],
      startHour: 6 // Morning starts at 6 AM
    },
    {
      id: 2,
      checkpoint: 'Midday Routine',
      tasks: [
        { id: 4, name: 'Stretch for 20 minutes.', points: 10, completed: false },
        { id: 5, name: 'Learn Russian for 30 minutes.', points: 15, completed: false },
        { id: 6, name: 'Learn Arabic for 30 minutes.', points: 15, completed: false },
      ],
      startHour: 12 // Midday starts at 12 PM
    },
    {
      id: 3,
      checkpoint: 'Evening Routine',
      tasks: [
        { id: 7, name: 'Meditate for 10 minutes.', points: 10, completed: false },
        { id: 8, name: 'Read for 30 minutes.', points: 15, completed: false },
        { id: 9, name: 'Code.', points: 15, completed: false },

      ],
      startHour: 17 // Evening starts at 5 PM
    },
    {
        id: 4,
        checkpoint: 'Night Routine',
        tasks: [
          { id: 10, name: 'Brush your teeth.', points: 10, completed: false },
          { id: 11, name: 'Drink glass of water.', points: 15, completed: false },
          { id: 12, name: 'Pray.', points: 15, completed: false },
  
        ],
        startHour: 21 // Evening starts at 5 PM
      }
  ];

  const loadTasksFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('hygieneTasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  };

  const [tasks, setTasks] = useState(loadTasksFromLocalStorage());
  const [score, setScore] = useState(0);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0); // Step 1: New state for tracking current checkpoint index


  // Function to clear tasks from local storage
  const clearTasksFromLocalStorage = () => {
    localStorage.removeItem('hygieneTasks');
    setTasks(initialTasks); // Reset tasks state to initial tasks after clearing local storage
  };

  const totalPoints = initialTasks.flatMap(checkpoint => checkpoint.tasks).reduce((sum, task) => sum + task.points, 0);

  useEffect(() => {
    const calculateInitialScore = () => {
      return tasks
        .flatMap((checkpoint) => checkpoint.tasks)
        .filter((task) => task.completed)
        .reduce((sum, task) => sum + task.points, 0);
    };

    setScore(calculateInitialScore());

    const interval = setInterval(() => {
      setTasks(initialTasks);
      setScore(0); // Reset score every 24 hours
      localStorage.removeItem('hygieneTasks'); // Clear saved tasks every 24 hours
    }, 86400000); // Reset tasks and score every 24 hours

    return () => clearInterval(interval);
  }, [tasks]);

  const saveTasksToLocalStorage = (updatedTasks) => {
    localStorage.setItem('hygieneTasks', JSON.stringify(updatedTasks));
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((checkpoint) => ({
      ...checkpoint,
      tasks: checkpoint.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
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
  const getProgressPercentage = () => (score / totalPoints) * 100;
  const showNextCheckpoint = () => {
    setCurrentCheckpointIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex < tasks.length ? nextIndex : prevIndex; // Ensure the index does not exceed the number of checkpoints
    });
  };

  return (
    <div>
      <h1>Refresh</h1>
      <h2>Score: {score} points</h2>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${getProgressPercentage()}%` }}></div>
      </div>
      {tasks
        .filter((checkpoint, index) => 
          getCurrentHour() >= checkpoint.startHour || index <= currentCheckpointIndex) // Step 2: Update filter logic
        .map((checkpoint) => (
          <Checkpoint key={checkpoint.id} checkpoint={checkpoint} onToggle={toggleTaskCompletion} />
        ))}
      <button onClick={clearTasksFromLocalStorage}>Clear Tasks</button>
      <button onClick={showNextCheckpoint}>Next</button> {/* Step 4: Add "Next" button */}
    </div>
  );
};

export default Hygiene;