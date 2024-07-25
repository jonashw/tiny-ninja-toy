import { OrbitControls, OrthographicCamera, Outlines, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createRef } from "react";
import { Group, MirroredRepeatWrapping, Object3DEventMap } from "three";
import { useWindowSize } from "./useWindowSize";

function Waves({
  radius,
  count,
  gap,
  width,
  showOutlines
}:{
  radius:number;
  count: number;
  gap:number;
  width: number;
  showOutlines?: boolean;
}){
  const d = 2 * radius;
  const groupLength = (d + gap) * count;
  const offset = groupLength/2;
  const groupRef = createRef<Group<Object3DEventMap>>();
  const texture = useTexture("/texture/water-ripples.jpg",(t) => {
    t.repeat.set(1,width/30);
    t.wrapS = MirroredRepeatWrapping;
    t.wrapT = MirroredRepeatWrapping;
  });
  useFrame(() => {
    const group = groupRef.current;
    if(!group){
      return;
    }
    const resetEveryXSegments = 2;
    group.position.x = (group.position.x + 0.05) % ((d + gap) * resetEveryXSegments);
    texture.offset.x = (texture.offset.x - 0.01) % ((d + gap) * resetEveryXSegments);
  });
  return (
    <group ref={groupRef}>
      {Array.from(Array(count).keys()).map(i => {
        const x = (d + gap) * i - offset;
        return (
          <mesh
            castShadow
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            position={[x, 0, 0]}
            key={i}
          >
            {i % 2 === 0
            ? <cylinderGeometry args={[
              radius, radius,
              width,
              20, 20,
              true,//openEnded
              0, Math.PI]} />
            : <cylinderGeometry args={[
              radius, radius,
              width,
              20, 20,
              true,//openEnded
              0, -Math.PI]} />
            }
            {showOutlines && <Outlines color={"white"} /> }
            {/* 
          #3884cf 
        */}
            <meshBasicMaterial
              transparent
              color={"#0f9da5"}
              map={texture}
              side={2} opacity={0.8}  />
          </mesh>
        );
      })}
    </group>
  );
}

export function Sketch07(){
  const windowSize = useWindowSize();
  const orthoZoom = 60;
  const ortho = true;
  return (
    <Canvas shadows flat style={{
      width:`${windowSize.width}px`,
      height:`${windowSize.height}px`
    }}>
      <Waves radius={3} count={20} gap={0} width={80} />
      <directionalLight color={"white"} position={[0,15,10]} castShadow/>
      <pointLight position={[0,10,5]} intensity={.5} castShadow/>
      {ortho && 
        <OrthographicCamera
          position={[5,5,5]}
          left={-windowSize.width/orthoZoom}
          right={windowSize.width/orthoZoom}
          top={windowSize.height/orthoZoom}
          bottom={-windowSize.height/orthoZoom}
          near={-1000}
          far={2000}
          makeDefault/>
      }
      <OrbitControls/>
    </Canvas>
  );
}