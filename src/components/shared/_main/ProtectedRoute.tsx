import AuthContext from "@/context/AuthContext";
import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: ReactNode }) {
  // Or other Logic to check if the user is authenticated
  const { user, isLoading } = useContext(AuthContext); 

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/log-in");
    }
  }, [user, navigate, isLoading]);

  if (!user) {
    return null;
  } else {
    return children;
  }
}

export default ProtectedRoute;
