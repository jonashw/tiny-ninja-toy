import { useCylinder } from "@react-three/cannon";
import { Edges, Outlines } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export function Trampoline(props: any) {
  const r = 3;
  const r_leg = 0.02;
  const surfaceThickness = 0.05;
  const legCount = 20;
  const legHeight = 0.25;
  const args: [number,number,number,number] = [r, r, surfaceThickness, 100];
  const legArgs: [number,number,number,number] = [r_leg, r_leg, legHeight, 10];
  const texture = useLoader(TextureLoader,'/texture/trampoline.png');
  const [ref] = useCylinder(() => ({
    material: {restitution:1},
    ...props,
    type:'Kinematic',
    args
  }));

  const outlineThickness = 0.005;
  
  return <>
    <mesh ref={ref as any} receiveShadow castShadow>
      <Outlines thickness={outlineThickness}/>
      <Edges color="black"/>
      <meshStandardMaterial  map={texture}/>
      <cylinderGeometry args={args} />
    </mesh>
    <group>
      {Array(legCount).fill(undefined).map((_,i) => 
        <group rotation={[0,(i / legCount)*2*Math.PI,0]}>
          <mesh
            key={i}
            position={[
              0,
              -(legHeight + surfaceThickness)/2,
              r - r_leg
            ]}
          >
            <Outlines thickness={outlineThickness}/>
            <meshStandardMaterial color={"#666666"}/>
            <cylinderGeometry args={legArgs} />
          </mesh>
        </group>
      )}
    </group>
  </>;
}