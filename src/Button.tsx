import { useNavigate } from "react-router-dom";

export function Button({
  onClick,
  to,
  children,
}:{
  onClick?:() => void,
  to?: string,
  children: React.ReactElement | string
}){
    const navigate = useNavigate();
    const click = 
        onClick
        ? onClick 
        : () => {
            if(!to){
                return;
            }
            navigate(to);
        };
  return <button onClick={click}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    {children}
  </button>
}