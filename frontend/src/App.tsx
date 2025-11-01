import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CreateSpace from "./pages/CreateSpace";
import Space from "./pages/Space";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<Dashboard />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/create-space" element={<CreateSpace />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/space/:spaceId" element={<Space />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
