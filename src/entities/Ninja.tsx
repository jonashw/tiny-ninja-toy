import { useSphere } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export function Ninja(props: any) {
  const s = 0.5;
  const [ref] = useSphere(() => ({
    mass: 1, 
    position: [0, 0, 0], ...props ,
    material: {restitution:1},
    args: [s/2,10]

  }))
  const texture = useLoader(TextureLoader,'/ninja.01-filled-transparent.png');
  return (
    <mesh
      ref={ref as any}
      castShadow
      receiveShadow
      onClick={e =>{
        e.stopPropagation();
      }}
    >
      <planeGeometry args={[s,s]}/>
      <meshStandardMaterial  map={texture} transparent={true} side={2} />
    </mesh>
  );
}