import allSketches from "./sketches/allSketches";
import { Button } from "./Button";

export default function SketchesIndex(){
    return (
        <div className="container px-4 py-2">
            <h1 className="font-sans text-xl mb-2">Sketches ({allSketches.length})</h1>
            <div className="grid gap-2 py-2 *:py-10 flex-wrap grid-cols-3">
                {allSketches.map((_, i) => (
                    <Button to={`/sketches/${i}`}>
                        {(i + 1).toString()}
                    </Button>
                ))}
            </div>
        </div>
    );
}