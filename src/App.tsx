import { Link } from "react-router-dom";

export function App(){
  return (
    <div className="p-4">
      <div>
        The Tiny Ninja Toy will appear here when it's ready.
      </div>
      <div>
        <img src="/ninja.01-filled.png" width={60}/>
      </div>
      <div>
        <Link to="/sketches" className="underline">Sketches</Link>
      </div>
    </div>
  );
}