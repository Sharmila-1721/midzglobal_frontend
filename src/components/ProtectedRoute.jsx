import {

  Navigate

} from 'react-router-dom';

function ProtectedRoute({

  children,

  role

}) {

  /* =========================
     GET TOKEN
  ========================= */

  const token =
    localStorage.getItem('token');

  /* =========================
     GET USER
  ========================= */

  const user =
    JSON.parse(
      localStorage.getItem('user')
    );

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!token || !user) {

    return <Navigate to='/login' />;

  }

  /* =========================
     ROLE CHECK
  ========================= */

  if (

    role &&
    user.role !== role

  ) {

    return <Navigate to='/login' />;

  }

  /* =========================
     ACCESS GRANTED
  ========================= */

  return children;

}

export default ProtectedRoute;