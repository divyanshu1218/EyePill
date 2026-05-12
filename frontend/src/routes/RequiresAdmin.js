import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../contexts";

const RequiresAdmin = ({ children }) => {
  const { token, userInfo } = useAuthContext();
  const location = useLocation();

  return token && userInfo?.role === 'admin' ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequiresAdmin;
