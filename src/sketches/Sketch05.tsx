import { Canvas } from '@react-three/fiber'
import {  Debug, Physics, Triplet } from '@react-three/cannon'
import { Environment, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { PerspectiveCamera as PerspectiveCameraImpl , Camera,  Group,  Vector3, Box3, Object3DEventMap, Euler } from 'three'
import React, { createRef, useCallback, useRef, useState } from 'react';
import { ColoredNinja, NinjaDeclaration } from '../entities/Ninja';
import { Trampoline } from '../entities/Trampoline';
import { Floor } from '../entities/Floor';
import { Button } from '../Button';

const z = 2;
const starterNinjas: NinjaDeclaration[] = [
  { position: [-1, 1.5, z], color: 'pink' },
  { position: [0, 1, z], color: 'teal' , scale: 1.3},
  { position: [1, 2, z], color: 'green', scale: 0.65 },
  { position: [2, 1.5, z], color: 'blue', velocity: [-0.1, 0, 0] },
  { position: [1, 1.5, z], color: 'red', scale: 1.6},
];

const defaultPerspectiveCameraPosition: Triplet = [0, 0.6, 7];

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

function withNewIds<T>(items: T[]): (T & {id: string})[]{
  return items.map(i => ({...i,id: crypto.randomUUID()}));
}
export function Sketch05(){
  const [ninjas,setNinjas] = React.useState<(NinjaDeclaration & {id: string} )[]>(withNewIds(starterNinjas));
  const cameraRef = useRef<PerspectiveCameraImpl | Camera>(null);
  const sceneGroupRef = useRef<Group>(null);
  const ninjaGroupRef = useRef<Group>(null);
  const canvasRef = createRef<HTMLCanvasElement>();
  const [orthographic,setOrthographic] = React.useState(false);
  const [debug,setDebug] = useState(false);
  const [environment,setEnvironment] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [cameraPosition,setCameraPosition] = useState<Triplet>(defaultPerspectiveCameraPosition);
  const [cameraRotation,setCameraRotation] = useState<Euler>(new Euler(0,0,0));

  const tryResetCamera = useCallback(function tryResetCamera(){
    console.log('try resetting camera...');
    if(!cameraRef.current){
      console.log('cannot reset camera because it is not ready yet');
      return;
    }
    if(!('fov' in cameraRef.current)){
      console.log('can only reset perspective cameras');
      return;
    }
    const camera = cameraRef.current;
    camera.position.set(...defaultPerspectiveCameraPosition);
    setCameraRotation(new Euler(0,0,0));
    setZoom(1);
    setCameraPosition(defaultPerspectiveCameraPosition);
  },[]);

  const tryZoom = useCallback(function tryZoom(zoomDelta: number){
    setZoom(zoom => {
      const currentZoom = zoom;
      const nextZoom = currentZoom + zoomDelta;
      console.log({currentZoom,nextZoom});
      return Math.max(0.5,nextZoom);
    });
  },[]);

  const tryFitGroup = useCallback(function tryFitNinjas(
    groupRef: React.RefObject<Group<Object3DEventMap>>,
    margin: number
  ){
    console.log('try fit ninjas...');
    if(!cameraRef.current || !groupRef.current){
      console.log('cannot fit because camera/scene is not ready yet');
      return;
    }
    if(!('fov' in cameraRef.current)){
      console.log('can only fit for perspective cameras');
      return;
    }
    console.log('ok');
    fitCameraToObjects(groupRef.current, cameraRef.current, margin);
  },[]);

  const tryFitNinjas = useCallback(function tryFitNinjas(){
    console.log('try fit ninjas...');
    if(!cameraRef.current || !ninjaGroupRef.current){
      console.log('cannot fit because camera/scene is not ready yet');
      return;
    }
    if(!('fov' in cameraRef.current)){
      console.log('can only fit for perspective cameras');
      return;
    }
    console.log('ok');
    fitCameraToObjects(ninjaGroupRef.current, cameraRef.current, 0.5);
  },[]);

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()){
        case "d": {
          setDebug(!debug);
          break;
        }
        case "f": {
          tryFitNinjas();
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
  },[orthographic, debug, environment]);

  const scene = (
    <>
      <Floor position={[0, -0.8, 0]} />
      <group ref={sceneGroupRef}>
        <group ref={ninjaGroupRef}>
          {ninjas.map((ninja) =>
            <ColoredNinja ninja={ninja} key={ninja.id} />
          )}
        </group>
        <Trampoline position={[0, 0, 0]} />
      </group>
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
      far={500}
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
      position={cameraPosition}
      zoom={zoom}
      rotation={cameraRotation}
      ref={e => {
        //console.log('persp',e);
        (cameraRef as any).current = e;
      }}
    />
  );

  return (
    <div
      style={{
        width:`${size.width}px`,
        height:`${size.height}px`,
        position:'relative'
      }}
    >
      <div className="left-0 right-0 bottom-0 absolute bg-white z-10">
        <div className="flex justify-around gap-2 p-2 flex-wrap">
          <Button onClick={() => tryFitGroup(ninjaGroupRef,0.5)}>See all Ninjas</Button>
          <Button onClick={() => tryResetCamera()}>Reset Camera</Button>
          <Button onClick={() => tryZoom(-0.25)}>Zoom Out</Button>
          <Button onClick={() => tryZoom( 0.25)}>Zoom In</Button>
          <Button onClick={() => {
            const camera = cameraRef.current;
            if(!camera){
              return;
            }
            if(!('fov' in camera)){
              return;
            }
            camera.lookAt(new Vector3(0,0,0));
          }}>LookAt(0,0,0)</Button>
          <Button onClick={() => setNinjas(withNewIds)}>Reset Ninjas</Button>
        </div>
      </div>
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
        setNinjas([...ninjas, {
          position: positionTriple,
          color: 'black',
          id: crypto.randomUUID()
        }]);
      }}
    >
      {camera}
      {environment && <Environment preset="park" background={true} />}
      <directionalLight color={"white"} position={[0,15,10]} castShadow />
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