import { RouteObject } from "react-router-dom";
import Sketches from "./Sketches";
import { App } from "./App";

export const routes: RouteObject[] = [
  {
    path:'/',
    element: <App/>
  },
  {
    path:'/sketches',
    element: <Sketches/>
  }
];