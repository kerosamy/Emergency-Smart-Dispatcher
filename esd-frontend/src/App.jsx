import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Layout from "./Components/Layout";

function App() {

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
