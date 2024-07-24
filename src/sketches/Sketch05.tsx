import { Canvas } from '@react-three/fiber'
import {  Debug, Physics, Triplet } from '@react-three/cannon'
import { Environment, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { Camera,  Vector3 } from 'three'
import React, { createRef, useRef, useState } from 'react';
import { Ninja } from '../entities/Ninja';
import { Trampoline } from '../entities/Trampoline';

function mouseEventToWorldSpace(
  canvas: HTMLCanvasElement,
  camera: Camera,
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  targetZ: number
){
  //adapted from: https://stackoverflow.com/a/13091694
  //console.log(camera.type === "OrthographicCamera");
  if('top' in camera && 'bottom' in camera && 'left' in camera && 'right' in camera){
    //console.log(camera.top);
  }
  const vector = new Vector3(
      (e.clientX / canvas.clientWidth ) * 2 - 1,
    -((e.clientY / canvas.clientHeight) * 2 - 1),
    0.5);
  vector.unproject(camera);
  vector.sub(camera.position).normalize();
  const distance = (targetZ - camera.position.z) / vector.z;
  const position = new Vector3();
  position.copy(camera.position).add(vector.multiplyScalar(distance));
  return position;
}

export function Sketch05(){
  const z = 0;
  const [extraNinjas,setExtraNinjas] = React.useState<Triplet[]>([
    [0,2,z]
  ]);
  const cameraRef = useRef<Camera>(null);
  const canvasRef = createRef<HTMLCanvasElement>();
  const [orthographic,setOrthographic] = React.useState(false);
  const [debug,setDebug] = useState(false);

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()){
        case "d": {
          setDebug(!debug);
          break;
        }
        case "c": {
          setOrthographic(!orthographic);
          break;
        }
      }
    };
    document.addEventListener('keypress', listener);
    return () => {
      document.removeEventListener('keypress',listener);
    };
  },[orthographic]);


  const scene = (
    <>
      <Ninja position={[-3, 3, z]} velocity={[0.5, 0, 0]} />
      <Ninja position={[3, 1, z]} velocity={[-0.1, 0, 0]} />
      {extraNinjas.map((position, i) =>
        <Ninja position={position} key={i} />
      )}
      <Trampoline position={[0, 0, 0]} />
    </>
  );

  const size = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const camera = orthographic ? (
    <OrthographicCamera
      makeDefault
      left={-size.width / 2}
      right={size.width / 2}
      top={size.height / 2}
      bottom={-size.height / 2}
      near={-10}
      far={10}
      zoom={100}
      ref={e => {
        //console.log('ortho',e);
        (cameraRef as any).current = e;
      }}
      position={[0.0, 0.5, 0.5]}
    />
  ) : (
    <PerspectiveCamera
      makeDefault
      position={[0, 0.5, 7]}
      ref={e => {
        //console.log('persp',e);
        (cameraRef as any).current = e;
      }}
    />
  );

  return (
    <div style={{width:`${size.width}px`, height:`${size.height}px`}}>
    <Canvas
      flat
      shadows
      ref={canvasRef}
      onClick={e => {
        if(!cameraRef.current){
          return;
        }
        const camera = cameraRef.current;
        const canvas = (e.target as HTMLCanvasElement);

        const position = mouseEventToWorldSpace(canvas, camera, e, z);
        setExtraNinjas([...extraNinjas, [position.x, position.y, position.z]]);
        //console.log({camera,position});
      }}
    >
      {camera}
      <Environment preset="park" background={true} />
      <directionalLight color={"white"} position={[0,20,0]}/>
      <pointLight position={[0,0,20]} intensity={.5}/>


      <Physics>
        {debug ? (
          <Debug color="black" scale={1} >
            {scene}
          </Debug>)
          : scene}
      </Physics>
    </Canvas>

    </div>
  );
}