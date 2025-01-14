import {jwtDecode} from 'jwt-decode';

export default function ValidadToken(token){
  
  if (token) {
    try {
      const { exp } = jwtDecode(token); 
      if (exp > Date.now() / 1000) { 
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}

