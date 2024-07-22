import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Physics, usePlane, useSphere } from '@react-three/cannon'
import { Edges, Environment, Outlines } from '@react-three/drei'
import { TextureLoader } from 'three'

function Trampoline(props: any) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material: {restitution:1},
    ...props,
    type:'Dynamic'
  }))
  return (
    <mesh ref={ref as any} receiveShadow castShadow>

      <Edges linewidth={2} threshold={15} color={"black"} />
      <Outlines thickness={0.01} color={"#c02040" } />
      <circleGeometry args={[5, 100]} />
    </mesh>
  )
}

function Ninja(props: any) {
  const [ref,api] = useSphere(() => ({
    mass: 1, 
    position: [0, 0, 0], ...props ,
    material: {restitution:1},
    args: [0.5,10]

  }))
  const texture = useLoader(TextureLoader,'/ninja.01-filled-transparent.png');
  useFrame(() => ref.current!.rotation.x += 0.01)
  return (
    <mesh ref={ref as any} castShadow receiveShadow onClick={() =>{
      api.velocity.set(0,5,0);
    }}>
      <planeGeometry args={[1,1]}/>
      <meshStandardMaterial map={texture} transparent={true} side={2}/>
    </mesh>
  )
}

export function Sketch05(){
  return (
    <Canvas camera={{position: [0,1,7]}}>
      <Environment preset="sunset" />
      <directionalLight color={"white"} position={[0,20,5]}/>
      <Physics>
        <Ninja position={[-3,3,3]} velocity={[0.5,0,0]}/>
        <Ninja position={[0,2,3]}/>
        <Ninja position={[3,1,3]}/>
        <Trampoline position={[0,0,0]}/>
      </Physics>
    </Canvas>
  );
}