import { SphereArgs, Triplet, useSphere } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import NinjaTexture, { NinjaColor } from "./NinjaTexture";

export type NinjaDeclaration = {
  position: Triplet,
  color: NinjaColor,
  velocity?: Triplet,
  scale?: number
};

export function Ninja(props: any) {
  const s = 0.5;
  const [ref] = useSphere(() => ({
    mass: 1, 
    position: [0, 0, 0], ...props ,
    material: {restitution:1},
    args: [s/2,10]

  }))
  const texture = useLoader(TextureLoader,'/ninja.01-filled-transparent-square.png');
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

export function ColoredNinja({
  ninja
}:{
  ninja: NinjaDeclaration
}) {
  const {position,color,scale} = ninja;
  //console.log(ninja);
  const s = 0.5 * (scale ?? 1);
  
  const [ref] = useSphere(() => ({
    mass: 1, 
    position,
    velocity: ninja.velocity,
    material: {restitution:1},
    args: [s/2] as SphereArgs

  }))
  const texture = NinjaTexture.useColoredNinjaTexture(color);
  return (
    <mesh
      ref={ref as any}
      castShadow
      receiveShadow
      onClick={e =>{
        e.stopPropagation();
      }}
      visible={!!texture}
    >
      <planeGeometry args={[s,s]}/>
      {texture && <meshStandardMaterial map={texture} transparent={true} side={2} /> }
    </mesh>
  );
}