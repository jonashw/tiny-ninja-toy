import { allNinjaColors, NinjaImageElement } from "../entities/NinjaTexture";

export function Sketch06(){
  return (
    <div className="flex flex-wrap gap-4">
      {allNinjaColors.map(color => 
        <NinjaImageElement key={color} color={color} />
      )}
    </div>
  );
}