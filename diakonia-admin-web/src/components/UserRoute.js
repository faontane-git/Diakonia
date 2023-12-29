import {Navigate, Outlet} from 'react-router-dom';

import {useAuthContext} from './AuthContext';

export default function PrivateRoute() {
  const {user} = useAuthContext();

  if (user.rol!=="Administrador") {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}