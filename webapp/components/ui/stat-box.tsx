import React from 'react';

interface StatBoxProps {
  label: string;
  value: number | string;
  modifier?: number;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, modifier }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black-1 rounded-lg w-24 h-24">
      <h3 className="text-16 font-bold text-white-1">{label}</h3>
      <div className="text-24 font-extrabold text-white-1">{value}</div>
      {modifier !== undefined && <div className="text-16 text-gray-1">({modifier >= 0 ? `+${modifier}` : modifier})</div>}
    </div>
  );
};

export default StatBox;
