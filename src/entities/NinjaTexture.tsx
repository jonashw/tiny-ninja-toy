import { Texture } from "three";
import { LayerDeclaration, LayeredImage, loadBlendedImageAsDataUrl, loadImageElement } from "../sketches/ImageEditor";
import { useEffect, useState } from "react";

function colorLayers(color: NinjaColor): LayerDeclaration[]{
  return [
    { src: "/texture/ninja-body-bitmask.png" },
    { src: `/texture/color/${color}.png`, blendingMode: "source-atop" },
    { src: "/texture/ninja-body-features-overlay.png" }
  ];
}

export type NinjaColor = 
  | "black"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "purple"
  | "pink"
  | "grey";

  const allNinjaColors: NinjaColor[] = 
  ["black"
  , "red"
  , "orange"
  , "yellow"
  , "green"
  , "teal"
  , "cyan"
  , "blue"
  , "purple"
  , "pink"
  , "grey"
  ];

function NinjaImageElement({color}:{color:NinjaColor}){
  return (
    <LayeredImage key={color} layers={[
      { src: "/texture/ninja-body-bitmask.png" },
      { src: `/texture/color/${color}.png`, blendingMode: "source-atop" },
      { src: "/texture/ninja-body-features-overlay.png" }
    ]} />
  );
}

function ninjaImageAsDataUrl(color: NinjaColor): Promise<string>{
  return loadBlendedImageAsDataUrl(colorLayers(color));
}

async function loadNinjaTexture(color: NinjaColor): Promise<Texture>{
  const texture = new Texture();
  const url = await loadBlendedImageAsDataUrl(colorLayers(color));
  const img = await loadImageElement(url);
  texture.image = img;
  texture.needsUpdate = true;
  return texture;
}

function useColoredNinjaTexture(color: NinjaColor){
  const [texture,setTexture] = useState<Texture>();
  useEffect(() => {
    loadNinjaTexture(color).then(setTexture);
  },[color]);
  return texture;
}

export default {
  allNinjaColors,
  NinjaImageElement,
  ninjaImageAsDataUrl,
  loadNinjaTexture,
  useColoredNinjaTexture
};