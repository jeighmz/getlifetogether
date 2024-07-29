import React from 'react';

const Task = ({ task, onToggle }) => {
  return (
    <div className="task">
      <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
      <span>{task.name} ({task.points} points)</span>
    </div>
  );
};

export default Task;