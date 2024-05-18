// Select Component
import React from 'react';

interface SelectProps {
  data: string[];
  name: string;
  register: any;  // The type can be more specific if desired
}

function Select({ data, name, register }: SelectProps) {
  return (
    <div>
      <select {...register(name)}>
        {data.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
