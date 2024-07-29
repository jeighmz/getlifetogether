import React from 'react';
import Task from './Task';

const Checkpoint = ({ checkpoint, onToggle }) => {
  return (
    <div className="checkpoint">
      <h2>{checkpoint.checkpoint}</h2>
      {checkpoint.tasks.map((task) => (
        <Task key={task.id} task={task} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default Checkpoint;