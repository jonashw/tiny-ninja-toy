import { useCylinder } from "@react-three/cannon";
import { Edges, Outlines } from "@react-three/drei";

export function Floor(props: any) {
    const s = 200;
    const args: [number, number, number, number] = [s, s, 1, 100];
    const [ref] = useCylinder(() => ({
        angularDamping: 1,
        material: {
            restitution: 0,
            rollInfluence: 1,
            friction: 1

        },
        ...props,
        type: 'Kinematic',
        args
    }));

    return <>
        <mesh ref={ref as any} receiveShadow castShadow>
            <Outlines thickness={0.1} />
            <Edges color="black" />
            <meshStandardMaterial color={"green"} />
            <cylinderGeometry args={args} />
        </mesh>
    </>;
}