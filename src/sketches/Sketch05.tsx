import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {  Physics, Triplet, useCylinder, useSphere } from '@react-three/cannon'
import { Edges, Environment, OrthographicCamera, Outlines } from '@react-three/drei'
import { Camera, TextureLoader, Vector3 } from 'three'
import React, { useRef } from 'react';

function Trampoline(props: any) {
  const r = 5;
  const args: [number,number,number,number] = [r, r, 0.05, 100];
  const [ref] = useCylinder(() => ({
    material: {restitution:1},
    ...props,
    type:'Kinematic',
    args
  }))
  
  return (
    <mesh ref={ref as any} receiveShadow castShadow>

      <Edges linewidth={2} threshold={15} color={"black"} />
      <Outlines thickness={0.01} color={"#c02040" } />
      <cylinderGeometry args={args} />
    </mesh>
  )
}

function Ninja(props: any) {
  const s = 0.5;
  const [ref,api] = useSphere(() => ({
    mass: 1, 
    position: [0, 0, 0], ...props ,
    material: {restitution:1},
    args: [s/2,10]

  }))
  const texture = useLoader(TextureLoader,'/ninja.01-filled-transparent.png');
  useFrame(() => ref.current!.rotation.x += 0.01)
  return (
    <mesh
      ref={ref as any}
      castShadow
      receiveShadow
      onClick={e =>{
        e.stopPropagation();
        api.velocity.set(0,5,0);
      }}
    >
      <planeGeometry args={[s,s]}/>
      <meshStandardMaterial map={texture} transparent={true} side={2}/>
    </mesh>
  )
}

function mouseEventToWorldSpace(
  canvas: HTMLCanvasElement,
  camera: Camera,
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  targetZ: number
){
  //adapted from: https://stackoverflow.com/a/13091694

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
  const [extraNinjas,setExtraNinjas] = React.useState<Triplet[]>([
    [0,2,3]
  ]);
  const cameraRef = useRef<Camera>();
  return (
    <>
    <Canvas
      onCreated={e => {
        console.log(e.camera);
        cameraRef.current = e.camera;
        e.camera.lookAt(new Vector3(0,3,0))
      }}
      camera={{position: [0,0.5,7]}}
      onClick={e => {
        if(!cameraRef.current){
          return;
        }
        const camera = cameraRef.current;
        const canvas = (e.target as HTMLCanvasElement);

        const position = mouseEventToWorldSpace(canvas, camera, e, 3);
        console.log(position);
        setExtraNinjas([...extraNinjas, [position.x, position.y, position.z]]);
      }}
    >
      <OrthographicCamera />
      <Environment preset="sunset" />
      <directionalLight color={"white"} position={[0,20,5]}/>

      <Physics>
        {/*<Debug color="black" scale={1.1}>*/}
          <Ninja position={[-3,3,3]} velocity={[0.5,0,0]}/>
          <Ninja position={[3,1,3]} velocity={[-0.1,0,0]}/>
          {extraNinjas.map((position,i) => 
            <Ninja position={position} key={i}/>
          )}
          <Trampoline position={[0,0,0]}/>
        {/*</Debug>*/}
      </Physics>
    </Canvas>

    </>
  );
}