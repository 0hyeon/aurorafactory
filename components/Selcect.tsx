// Select Component
import React from 'react';

interface SelectProps {
  data: string[];
  name: string;
  register: any;  // The type can be more specific if desired
  errors:any;
}

function Select({ data, name, register,errors }: SelectProps) {
  return (
    <div>
      <select {...register(name)} >
        {data.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </select>
      {[errors.name?.message ?? ""]}
    </div>
  );
}

export default Select;
