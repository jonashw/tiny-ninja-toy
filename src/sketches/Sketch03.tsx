import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {  Edges, Environment, OrbitControls, Outlines } from '@react-three/drei'


function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!); // This reference will give us direct access to the THREE.Mesh object
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() =>  (ref.current.rotation.x += (hovered ? 0.03 : clicked ? 0.02 : 0.01)))

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
      <boxGeometry args={[1, 2, 0.5]} />
      <Edges linewidth={2} threshold={15} color={hovered ? "#c02040" : "black"} />
      <Outlines thickness={0.01} color={hovered ? "#c02040" : "black"} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export function Sketch03(){
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight color={"white"} position={[0,0,5]}/>
      <group>
        {Array(6).fill(undefined).map((_,i,items) => {
          const w = 2.4;
          const center = items.length * w / 2;
          return <Box key={i} position={[(i+0.5)*w - center, 0, 0]} />
        })}
      </group>
      <Environment preset="sunset" />
    </Canvas>
  );
}