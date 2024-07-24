import { RouteObject } from "react-router-dom";
import { App } from "./App";
import SketchIndex from "./SketchIndex";
import SketchGalleryViewer from "./SketchGalleryViewer";

export const routes: RouteObject[] = [
  {
    path:'/',
    element: <App/>
  },
  {
    path:'/sketches',
    element: <SketchIndex/>
  },
  {
    path:'/sketches/:sketchIndex',
    element: <SketchGalleryViewer/>
  }
];