import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <div>
      <ToastContainer></ToastContainer>
      <NavBar />
    </div>
  );
}

export default App;
