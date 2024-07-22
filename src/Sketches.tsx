import React from 'react';
import { Sketch01 } from './sketches/Sketch01';
import { Sketch02 } from './sketches/Sketch02';
import { CircularArray } from './CircularArray';

export default function Sketches() {
  const [sketches,setSketches] = React.useState(new CircularArray([Sketch01,Sketch02]));
  const CurrentSketch = sketches.current;
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', gap:'5px', padding:'5px'}}>
        <button onClick={() => setSketches(sketches.prev())} style={{flexGrow:1}}>Prev</button>
        <button onClick={() => setSketches(sketches.next())} style={{flexGrow:1}}>Next</button>
      </div>
      <CurrentSketch/>
    </div>
  );
}