import {Navigate, Outlet} from 'react-router-dom';
import { Routes, Route } from "react-router-dom"
import {useAuthContext} from './AuthContext';


export default function PrivateRoute() {
  const {user} = useAuthContext();

  if (user===null) {

    return <Navigate to="/login" />;
  }else{
    if(user.rol==="Registrador"){
        return <Navigate to="/Registrador" />; 
    }
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}