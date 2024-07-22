import React from 'react';
import { Sketch01 } from './sketches/Sketch01';
import { Sketch02 } from './sketches/Sketch02';
import { CircularArray } from './CircularArray';

function Button({
  onClick,
  children
}:{
  onClick?:() => void,
  children: React.ReactElement | string
}){
  return <button onClick={onClick}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    {children}
  </button>
}

export default function Sketches() {
  const [sketches,setSketches] = React.useState(new CircularArray([Sketch01,Sketch02]));
  const CurrentSketch = sketches.current;
  return (
    <div>
      <div className="flex justify-between p-2 gap-2 [&>*]:flex-grow">
        <Button onClick={() => setSketches(sketches.prev())}>Prev</Button>
        <Button onClick={() => setSketches(sketches.next())}>Next</Button>
      </div>
      <CurrentSketch/>
    </div>
  );
}