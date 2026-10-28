import { useEffect, useState } from "react";
import { apiFetch } from "../api.js";

export default function CommentsManager({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    apiFetch(`/posts/${postId}/comments`)
      .then(setComments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId]);

  function startEdit(comment) {
    setEditingId(comment.id);
    setDraft(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }

  async function saveEdit(comment) {
    setError(null);
    try {
      const updated = await apiFetch(
        `/posts/${postId}/comments/${comment.id}`,
        { method: "PUT", body: JSON.stringify({ content: draft }) },
      );
      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? updated : c)),
      );
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(comment) {
    if (!window.confirm("Delete this comment?")) return;
    setError(null);
    try {
      await apiFetch(`/posts/${postId}/comments/${comment.id}`, {
        method: "DELETE",
      });
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading comments...</p>;

  return (
    <section>
      <h2>Comments ({comments.length})</h2>
      {error && <p role="alert">{error}</p>}
      {comments.length === 0 && <p>No comments on this post.</p>}

      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <strong>{comment.user?.username ?? "Deleted user"}</strong>{" "}
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
          {editingId === comment.id ? (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={1000}
                rows={3}
              />
              <button onClick={() => saveEdit(comment)}>Save</button>
              <button className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>{comment.content}</p>
              <button className="secondary" onClick={() => startEdit(comment)}>
                Edit
              </button>
              <button className="danger" onClick={() => handleDelete(comment)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </section>
  );
}
