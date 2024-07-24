import { Triplet, useCylinder } from "@react-three/cannon";

export function Floor(props: any & {belowPosition?: Triplet}) {
    const s = 200;
    const h = 1;
    const args: [number, number, number, number] = [s, s, h, 5];
    const [ref] = useCylinder(() => ({
        angularDamping: 1,
        material: {
            restitution: 0,
            rollInfluence: 1,
            friction: 1
        },
        ...props,
        position: 
            props.belowPosition === undefined 
            ? props.position 
            : [0,props.belowPosition.y - h/2,0],
        type: 'Kinematic',
        args
    }));

    return <>
        <mesh ref={ref as any} receiveShadow>
            <meshStandardMaterial color={"#93A150"} />
            <cylinderGeometry args={args} />
        </mesh>
    </>;
}