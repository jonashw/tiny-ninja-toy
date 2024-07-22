import React from 'react';
import { Sketch01 } from './sketches/Sketch01';
import { Sketch02 } from './sketches/Sketch02';
import { Sketch03 } from './sketches/Sketch03';
import { Sketch04 } from './sketches/Sketch04';
import { CircularArray } from './CircularArray';
import { useParams } from 'react-router-dom';

const allSketches = [
  Sketch01,
  Sketch02,
  Sketch03,
  Sketch04,
];

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
  const params = useParams();
  const defaultIndex = 
    'sketchIndex' in params ? parseInt(params.sketchIndex ?? "") ?? 0
    : 0;
  const [sketches,setSketches] = React.useState(new CircularArray(allSketches, defaultIndex));
  const CurrentSketch = sketches.current;
  return (
    <div>
      <div className="flex justify-between items-center p-2 gap-2 [&>button]:flex-grow">
        <Button onClick={() => setSketches(sketches.prev())}>Prev</Button>
        <span>{sketches.currentIndex + 1} of {sketches.items.length}</span>
        <Button onClick={() => setSketches(sketches.next())}>Next</Button>
      </div>
      <CurrentSketch/>
    </div>
  );
}