import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/AddUser" element={<AddUser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
