import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {  Environment, OrbitControls } from '@react-three/drei'


function Box(props: JSX.IntrinsicElements['mesh']) {

  const ref = useRef<THREE.Mesh>(null!); // This reference will give us direct access to the THREE.Mesh object
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() =>  (ref.current.rotation.z += (hovered ? 0.03 : clicked ? 0.02 : 0.08)))
  const texture = useLoader(THREE.TextureLoader,'/ninja.01-filled-transparent.png');
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      castShadow
    >
      <boxGeometry args={[1, 2, 0.0]} />
      <meshStandardMaterial map={texture} transparent={true}/>
    </mesh>
  )
}

export function Sketch04(){
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight color={"white"} position={[0,0,5]}/>
          <Box position={[0, 0, 0]} />
      <Environment preset="sunset" />
    </Canvas>
  );
}