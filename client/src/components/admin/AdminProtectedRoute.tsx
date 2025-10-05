// import { useAppSelector } from "../../hooks/hooks";
// import { Navigate } from "react-router-dom";

// interface Props {
//   children: React.ReactNode;
// }

// const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
//   const { admin } = useAppSelector((state) => state.adminAuth);

//   if (!admin) {
//     return <Navigate to="/admin-signin" replace />;
//   }

//   return <>{children}</>;
// };

// export default AdminProtectedRoute;


import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

interface Props {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const { admin, accessToken } = useAppSelector((state) => state.adminAuth);
  const storedAdmin = localStorage.getItem("admin");
  const storedToken = localStorage.getItem("adminAccessToken");

  if ((!admin || !accessToken) && (!storedAdmin || !storedToken)) {
    return <Navigate to="/admin-signin" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
