import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api.js";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/posts?all=true")
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function togglePublished(post) {
    setError(null);
    try {
      const updated = await apiFetch(`/posts/${post.id}/publish`, {
        method: "PATCH",
        body: JSON.stringify({ published: !post.published }),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, published: updated.published } : p,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`Delete "${post.title}" and all its comments?`)) return;
    setError(null);
    try {
      await apiFetch(`/posts/${post.id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading posts...</p>;

  return (
    <section>
      <div className="page-head">
        <h1>Your posts</h1>
        <Link to="/posts/new" className="button">
          New post
        </Link>
      </div>

      {error && <p role="alert">{error}</p>}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>
                    <span
                      className={post.published ? "badge published" : "badge"}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{post._count.comments}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="secondary"
                      onClick={() => togglePublished(post)}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="button secondary"
                    >
                      Edit
                    </Link>
                    <button
                      className="danger"
                      onClick={() => handleDelete(post)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
