import { jwtDecode } from "jwt-decode";

export default function ValidadRole(token){
  
    if (token) {
      try {
        const { exp,role } = jwtDecode(token); 
        if (exp > Date.now() / 1000 && role=="supervisor") { 
          return 1;
        }else if(exp > Date.now() / 1000 && role=="admin"){
          return 2
        }       
        else {
          return 0;
        }
      } catch (error) {
        return 0;
      }
    }
  }