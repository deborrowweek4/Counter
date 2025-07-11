import React, { useState } from 'react';

function Counter({ increment, decrement }) {
  const [value, setValue] = useState('');

  const handleIncrement = () => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      increment(num);
      setValue('');
    }
  };

  const handleDecrement = () => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      decrement(num);
      setValue('');
    }
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value"
      />
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
}

export default Counter;
