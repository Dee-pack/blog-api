import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <>
      <header>
        <Link to="/">My Blog</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}