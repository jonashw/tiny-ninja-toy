import { useCylinder } from "@react-three/cannon";
import { Edges } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export function Trampoline(props: any) {
  const r = 5;
  const args: [number,number,number,number] = [r, r, 0.05, 100];
  const texture = useLoader(TextureLoader,'/texture/trampoline.png');
  const [ref] = useCylinder(() => ({
    material: {restitution:1},
    ...props,
    type:'Kinematic',
    args
  }))
  
  return <>
    <mesh ref={ref as any} receiveShadow castShadow>
      <Edges linewidth={2} threshold={15} color={"black"} />
      <meshStandardMaterial  map={texture}/>
      <cylinderGeometry args={args} />
    </mesh>
  </>;
}