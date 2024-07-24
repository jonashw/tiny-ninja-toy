import { Canvas } from '@react-three/fiber'
import {  Debug, Physics, Triplet } from '@react-three/cannon'
import { Environment, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { PerspectiveCamera as PerspectiveCameraImpl , Camera,  Group,  Vector3, Box3 } from 'three'
import React, { createRef, useRef, useState } from 'react';
import { ColoredNinja, NinjaDeclaration } from '../entities/Ninja';
import { Trampoline } from '../entities/Trampoline';
import { Floor } from '../entities/Floor';

const z = 0;
const starterNinjas: NinjaDeclaration[] = [
  { position: [-1, 1.5, z], color: 'pink' },
  { position: [0, 1, z], color: 'teal' , scale: 1.3},
  { position: [1, 2, z], color: 'green', scale: 0.65 },
  { position: [2, 1.5, z], color: 'blue', velocity: [-0.1, 0, 0] },
  { position: [1, 1.5, z], color: 'red', scale: 1.6},
];

function fitCameraToObjects( group:Group, camera:PerspectiveCameraImpl, margin: number = 1.2) {
  const box = new Box3().setFromObject( group );
  const size = box.getSize( new Vector3() );
  const center = box.getCenter( new Vector3() );
  const maxSize = Math.max( size.x, size.y );
  const fitHeightDistance = maxSize / ( 2 * Math.atan( ( Math.PI * camera.fov) / 360 ) );
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = margin * Math.max( fitHeightDistance, fitWidthDistance );

  //const currentCameraPos = new Vector3().copy( camera.position )
  const direction = center.clone().sub( camera.position ).normalize().multiplyScalar( distance )

  const goalCameraPos = new Vector3().copy( center ).sub( direction )
  const goalFocusVec = new Vector3().copy( center );
  camera.position.copy( goalCameraPos )
  camera.lookAt( goalFocusVec )
}

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
  const [extraNinjas,setExtraNinjas] = React.useState<NinjaDeclaration[]>(starterNinjas);
  const cameraRef = useRef<PerspectiveCameraImpl | Camera>(null);
  const sceneGroupRef = useRef<Group>(null);
  const ninjaGroupRef = useRef<Group>(null);
  const canvasRef = createRef<HTMLCanvasElement>();
  const [orthographic,setOrthographic] = React.useState(false);
  const [debug,setDebug] = useState(false);
  const [environment,setEnvironment] = useState(true);

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()){
        case "d": {
          setDebug(!debug);
          break;
        }
        case "f": {
          if(!cameraRef.current || !sceneGroupRef.current || !ninjaGroupRef.current){
            console.log('cannot fit because camera/scene is not ready yet');
            return;
          }
          if(!('fov' in cameraRef.current)){
            console.log('can only fit for perspective cameras');
            return;
          }
          fitCameraToObjects(ninjaGroupRef.current, cameraRef.current, 0.5);
          break;
        }
        case "e": {
          setEnvironment(!environment);
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
    <group ref={sceneGroupRef}>
      <group ref={ninjaGroupRef}>
        {extraNinjas.map((ninja, i) =>
          <ColoredNinja ninja={ninja} key={i} />
        )}
      </group>
      <Trampoline position={[0, 0, 0]} />
      <Floor position={[0, -1, 0]} />
    </group>
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
      position={[0, 0.6, 7]}
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
        const positionTriple: Triplet = [position.x, position.y, position.z];
        console.log({positionTriple});
        setExtraNinjas([...extraNinjas, {
          position: positionTriple,
          color: 'black'
        }]);
        //console.log({camera,position});
      }}
    >
      {camera}
      {environment && <Environment preset="park" background={true} />}
      <directionalLight color={"white"} position={[0,20,0]} />
      <pointLight position={[0,10,5]} intensity={.5}/>

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