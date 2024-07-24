import { LayeredImage } from "../sketches/ImageEditor";

export type NinjaColor = 
  | "black"
  | "red"
  | "orange"
  | "yellow"
  | "green"
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

export {
  allNinjaColors,
  NinjaImageElement
};