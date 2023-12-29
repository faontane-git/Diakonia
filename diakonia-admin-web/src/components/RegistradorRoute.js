import {Navigate, Outlet} from 'react-router-dom';

import {useAuthContext} from './AuthContext';


export default function PrivateRoute() {
  const {user} = useAuthContext();

  if (user===null) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}