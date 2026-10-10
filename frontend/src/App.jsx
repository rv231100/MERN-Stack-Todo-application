import { useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
