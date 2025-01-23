import { Navigate } from "react-router-dom";
import ValidadAmbosUsuarios from "./utils/ValidadAmbosUsuarios";
export default function ProtectedAmbosUsuarios({children}){
    const token = localStorage.getItem("token")

    if(ValidadAmbosUsuarios(token)){
        return children;
    }
    else{
       return <Navigate to="/"/>
    }

    
}