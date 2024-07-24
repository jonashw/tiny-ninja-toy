import NinjaTexture from "../entities/NinjaTexture";

export function Sketch06(){
  return (
    <div className="flex flex-wrap gap-4 pt-8">
      {NinjaTexture.allNinjaColors.map(color => 
        <NinjaTexture.NinjaImageElement key={color} color={color} />
      )}
    </div>
  );
}