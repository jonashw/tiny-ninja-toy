import { useEffect, useState } from "react";

export type LayerDeclaration = {
  src: string,
  filter?: string,
  blendingMode?: GlobalCompositeOperation
};

async function loadBlendedImageAsDataUrl(layers: LayerDeclaration[]): Promise<string> {
  const imgs = await loadImageElements(layers.map(l => l.src));

  if (imgs.length === 0) {
    return "";
  }
  const size = imgs.reduce(
    (size, img) => ({
      width: Math.max(size.width, img.width),
      height: Math.max(size.height, img.height)
    }),
    { width: 0, height: 0 })
  const c = new OffscreenCanvas(size.width, size.height);
  const ctx = c.getContext("2d")!;
  for (let i = 0; i < layers.length; i++) {
    ctx.save();
    const layer = layers[i];
    const img = imgs[i];
    if (layer.filter !== undefined) {
      ctx.filter = layer.filter;
    }
    if (layer.blendingMode !== undefined) {
      ctx.globalCompositeOperation = layer.blendingMode;
    }
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }
  const blob = await c.convertToBlob();
  return URL.createObjectURL(blob);
}

const Cache = new Map<string,HTMLImageElement>();

async function loadImageElement(src: string){
  return new Promise<HTMLImageElement>((resolve,reject) => {
    const cachedImg = Cache.get(src);
    if(cachedImg){
      resolve(cachedImg);
    }
    const img = new Image();
    img.onload = () => {
      Cache.set(src,img);
      resolve(img);
    };
    img.onerror = (e) => {
      console.error('unable to load src:', src);
      console.error(e);
      reject();
    }
    img.src = src;
  });
}

async function loadImageElements(src: string[]){
  return Promise.all(src.map(loadImageElement));
}

function LayeredImage({
  layers
}: {
  
  layers: LayerDeclaration[]
}){
  const [url,setUrl] = useState("");

  useEffect(() => {
    async function effect(){
      const url = await loadBlendedImageAsDataUrl(layers);
      setUrl(url);
    }

    effect();
  },[layers]);

  return <img src={url}/>;
}

export {
    loadBlendedImageAsDataUrl,
    loadImageElement,
    loadImageElements,
    LayeredImage
};