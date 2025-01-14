import ValidadToken from "./utils/validadToken";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({children}){
    const token = localStorage.getItem("token")

    if(ValidadToken(token)){
        return children;
    }
    else{
       return <Navigate to="/"/>
    }

    
}