import { jwtDecode } from "jwt-decode";

export default function ValidadAdmin(token){
  
    if (token) {
      try {
        const { exp,role } = jwtDecode(token); 
        if (exp > Date.now() / 1000 && role=="admin")return true; 
        else return false;        
      } catch (error) {
        return false;
      }
    }
  }