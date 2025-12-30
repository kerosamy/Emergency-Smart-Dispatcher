import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./Components/Layout";
import { wsService } from "./services/websocketService";

function App() {
    useEffect(() => {
    
    wsService.connect(
      (status) => console.log("🟢 WS status:", status),
    );
    return () => {
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, element, isProtected }) => {
          const wrappedElement = isProtected ? <Layout>{element}</Layout> : element;
          return <Route key={path} path={path} element={wrappedElement} />;
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
