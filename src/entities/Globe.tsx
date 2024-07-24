import { SphereArgs, useSphere } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";

export function Globe(props: any) {
  //console.log(ninja);
  const s = 0.5 * (props.scale ?? 1);
  
  const [ref] = useSphere(() => ({
    mass: 1, 
    position: props.position,
    angularDamping: 0.9,
    velocity: props.velocity,
    material: {restitution:1},
    args: [s/2] as SphereArgs

  }))
  const texture = useTexture('/texture/earth_land_ocean_ice_cloud_2048.jpg');
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
      <sphereGeometry args={[s/2,20,20]}/>
      {texture && <meshStandardMaterial map={texture} transparent={true} side={2} /> }
    </mesh>
  );
}