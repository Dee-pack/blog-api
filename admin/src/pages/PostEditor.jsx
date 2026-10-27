import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiFetch } from "../api.js";
import CommentsManager from "../components/CommentsManager.jsx";

export default function PostEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    apiFetch(`/posts/${id}`)
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit) {
        await apiFetch(`/posts/${id}`, {
          method: "PUT",
          body: JSON.stringify({ title, content }),
        });
      } else {
        await apiFetch("/posts", {
          method: "POST",
          body: JSON.stringify({ title, content, published }),
        });
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <Link to="/">← Back to posts</Link>
      <h1>{isEdit ? "Edit post" : "New post"}</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            required
          />
        </label>

        {!isEdit && (
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish immediately
          </label>
        )}

        {error && <p role="alert">{error}</p>}

        <button disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create post"}
        </button>
      </form>
      {isEdit && <CommentsManager postId={id} />}
    </section>
  );
}
