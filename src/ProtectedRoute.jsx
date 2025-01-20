import { Navigate } from "react-router-dom";
import ValidadToken from "./utils/validadToken";
export default function ProtectedRoute({children}){
    const token = localStorage.getItem("token")

    if(ValidadToken(token)==1||ValidadToken(token)==2){
        return children;
    }
    else{
       return <Navigate to="/"/>
    }

    
}