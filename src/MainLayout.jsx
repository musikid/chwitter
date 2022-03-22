import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavigationPanel from "./components/NavigationPanel";
import "./MainLayout.css";
import { useAuth } from "./providers/AuthProvider";

const MainLayout = ({}) => {
  const { user, signOut } = useAuth();
  const navigateFunction = useNavigate();
  const isConnected = user !== null;
  const navigate = navigateFunction.bind(null, isConnected ? "/login" : "/");
  const authAction = isConnected ? signOut.bind(null, navigate) : navigate;

  return (
    <div className="main-layout">
      <NavigationPanel
        {...user}
        authAction={authAction}
        isConnected={isConnected}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
