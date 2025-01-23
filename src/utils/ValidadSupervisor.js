import { jwtDecode } from "jwt-decode";

export default function ValidadSupervisor(token){
  
    if (token) {
      try {
        const { exp,role } = jwtDecode(token); 
        if (exp > Date.now() / 1000 && role=="supervisor")return true; 
        else return false;        
      } catch (error) {
        return false;
      }
    }
  }