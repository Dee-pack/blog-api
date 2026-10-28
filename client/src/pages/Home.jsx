import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api.js";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/posts")
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Could not load posts: {error}</p>;
  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <section>
      <h1>Latest posts</h1>
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <h2>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h2>
          <p className="meta">
            By {post.author.username} on{" "}
            {new Date(post.createdAt).toLocaleDateString()} ·{" "}
            {post._count.comments} comments
          </p>
          <p>{post.content.slice(0, 150)}...</p>
        </article>
      ))}
    </section>
  );
}
