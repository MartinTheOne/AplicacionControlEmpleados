import { Navigate } from "react-router-dom";
import ValidadAdmin from "./utils/ValidadAdmin";
export default function ProtectedRouteAdmin({children}){
    const token = localStorage.getItem("token")

    if(ValidadAdmin(token)){
        return children;
    }
    else{
       return <Navigate to="/"/>
    }

    
}