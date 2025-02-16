import { Navigate } from "react-router-dom";
import ValidadSupervisor from "./utils/ValidadSupervisor";
export default function ProtectedRoute({children}){
    const token = localStorage.getItem("token")

    if(ValidadSupervisor(token)){
        return children;
    }
    else{
       return <Navigate to="/"/>
    }

    
}