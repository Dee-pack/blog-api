import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Post from "./pages/Post.jsx";
import AuthPage from "./pages/AuthPage.jsx";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <header>
        <Link to="/">My Blog</Link>
        <nav>
          {user ? (
            <>
              <span>{user.username}</span>
              <button className="secondary" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </>
  );
}
