import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostDetails from '../components/post/PostDetails';
import CommentSection from '../components/post/CommentSection';
import EditPost from '../components/post/EditPost';
import { api } from '../api';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/auth/me')
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, []);

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api(`/api/posts/${postId}`);
      setPost(data.post);
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleComment = async (commentText) => {
    try {
      await api(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: commentText }),
      });
      await fetchPost();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      await fetchPost();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await api(`/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          description: updatedData.description,
          hashtags: updatedData.hashtags || [],
        }),
      });
      setIsEditing(false);
      await fetchPost();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      await api(`/api/posts/${postId}`, { method: 'DELETE' });
      navigate('/home');
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="post-page flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-[color:var(--color-gray-light)] border-t-[color:var(--color-primary)] rounded-full animate-spin mb-4" />
          <p className="text-[color:var(--color-gray)]">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-page flex flex-col items-center justify-center min-h-[400px] text-center gap-4 p-8">
        <span className="not-found-icon">🔍</span>
        <h2 className="text-xl md:text-2xl">Post Not Found</h2>
        <p className="text-[color:var(--color-gray)]">
          {error || "The post you're looking for doesn't exist."}
        </p>
        <Link
          to="/home"
          className="btn btn-primary px-5 py-2.5 text-sm rounded-full"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?._id === post.owner?._id?.toString();

  if (isEditing) {
    return (
      <div className="post-page max-w-[900px] mx-auto p-2 md:p-8 min-h-screen">
        <div className="flex flex-col gap-4 md:gap-8">
          <button
            className="back-button px-2 py-1 md:px-4 md:py-2"
            onClick={() => setIsEditing(false)}
          >
            ← Back to Post
          </button>
          <EditPost
            post={post}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="post-page max-w-[900px] mx-auto p-2 md:p-8 min-h-screen">
      <div className="flex flex-col gap-4 md:gap-8">
        <Link to="/home" className="back-button px-2 py-1 md:px-4 md:py-2">
          ← Back to Feed
        </Link>

        <PostDetails
          post={post}
          isOwner={isOwner}
          currentUser={currentUser}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDeletePost}
        />

        <CommentSection
          postId={postId}
          comments={post.comments || []}
          onAddComment={handleComment}
          onDeleteComment={handleDeleteComment}
          currentUser={currentUser}
          onCommentsChange={(updater) =>
            setPost((prev) =>
              prev
                ? {
                    ...prev,
                    comments:
                      typeof updater === 'function'
                        ? updater(prev.comments || [])
                        : updater,
                  }
                : prev
            )
          }
        />
      </div>
    </div>
  );
};

export default PostPage;