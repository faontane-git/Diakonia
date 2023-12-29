import {Navigate, Outlet} from 'react-router-dom';

import {useAuthContext} from './AuthContext';

export default function PrivateRoute() {
  const {user} = useAuthContext();

  if (user!==null) {
    if(user.rol==="Registrador"){
        return <Navigate to="/Registrador" />; 
    }else{
        return <Navigate to="/" />; 
    }
    
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}