import { CircularArray } from './CircularArray';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import allSketches from './sketches/allSketches';
import { Button } from './Button';
import { SpeedControls } from './SpeedControls';
import { clickButton } from './speed';

export default function SketchGalleryViewer() {
  const params = useParams();
  const navigate = useNavigate();
  const defaultIndex = 
    'sketchIndex' in params ? parseInt(params.sketchIndex ?? "") ?? 0
    : 0;
  const [sketches,setSketches] = React.useState(new CircularArray(allSketches, defaultIndex));
  const CurrentSketch = sketches.current;

  function go(s: CircularArray<() => JSX.Element>){
    setSketches(s);
    navigate(`/sketches/${s.currentIndex}`);
  }
  return (
    <div>
      <div className="left-0 right-0 top-0 fixed bg-white z-10">
        <div className="flex justify-between items-center p-2 gap-2 [&>button]:flex-grow">
          <Button onClick={() => go(sketches.prev())}>Prev</Button>
          <span
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate('/sketches');
            }}
          >{sketches.currentIndex + 1} of {sketches.items.length}</span>
          <Button onClick={() => go(sketches.next())}>Next</Button>
          <SpeedControls
            spec={() => ({
              // five seconds on each sketch; seven Nexts come back round to where it started
              seconds: 40,
              steps: allSketches.map((_, i) => ({ at: 5 * (i + 1), mark: "next sketch", run: () => clickButton('Next') })),
            })}
          />
        </div>
      </div>
      <CurrentSketch/>
    </div>
  );
}