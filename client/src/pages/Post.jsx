import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Post() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [content, setContent] = useState("");
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    Promise.all([
      apiFetch(`/posts/${id}`),
      apiFetch(`/posts/${id}/comments`),
    ])
      .then(([postData, commentData]) => {
        setPost(postData);
        setComments(commentData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleComment(e) {
    e.preventDefault();
    setCommentError(null);
    try {
      const newComment = await apiFetch(`/posts/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      setCommentError(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <article>
      <Link to="/">← Back to all posts</Link>
      <h1>{post.title}</h1>
      <p>
        By {post.author.username} on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>

      <section>
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
          <div key={c.id}>
            <strong>{c.user?.username ?? "Deleted user"}</strong>{" "}
            <small>{new Date(c.createdAt).toLocaleString()}</small>
            <p>{c.content}</p>
          </div>
        ))}

        {user ? (
          <form onSubmit={handleComment}>
            <label>
              Add a comment
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                required
              />
            </label>
            {commentError && <p role="alert">{commentError}</p>}
            <button>Post comment</button>
          </form>
        ) : (
          <p>
            <Link to="/login">Log in</Link> to leave a comment.
          </p>
        )}
      </section>
    </article>
  );
}