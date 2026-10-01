import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PostDetails from '../components/post/PostDetails';
import CommentSection from '../components/post/CommentSection';
import EditPost from '../components/post/EditPost';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{"id":1,"name":"Alice Johnson","username":"alicej"}');
    setCurrentUser(user);

    const fetchPost = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockPost = {
          id: parseInt(postId) || 1,
          user: {
            id: 1,
            name: 'Alice Johnson',
            username: 'alicej',
            avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=6C63FF&color=fff&size=60',
          },
          image: 'https://picsum.photos/seed/1/800/600',
          description: 'Beautiful sunset at the beach! This was taken during my trip to Bali last summer.',
          hashtags: ['#sunset', '#beach', '#nature'],
          createdAt: new Date('2026-08-30T14:30:00'),
          location: 'Bali, Indonesia',
          camera: 'Sony A7III',
          likes: 42,
          isLiked: false,
          isReported: false
        };

        setPost(mockPost);
        setLikesCount(mockPost.likes);
        
        const mockComments = [
          {
            id: 1,
            user: {
              id: 2,
              name: 'Bob Smith',
              username: 'bobs',
              avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=FF6584&color=fff&size=40'
            },
            text: 'Amazing shot! The colors are incredible',
            createdAt: new Date('2026-08-30T15:00:00'),
            likes: 5,
            isLiked: false
          },
          {
            id: 2,
            user: {
              id: 3,
              name: 'Carol Davis',
              username: 'carold',
              avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=00D4AA&color=fff&size=40'
            },
            text: 'Where exactly in Bali is this? I\'d love to visit!',
            createdAt: new Date('2026-08-30T15:30:00'),
            likes: 3,
            isLiked: false
          }
        ];
        
        setComments(mockComments);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleLikeComment = (commentId) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const isLiked = !comment.isLiked;
          return {
            ...comment,
            isLiked: isLiked,
            likes: isLiked ? (comment.likes || 0) + 1 : (comment.likes || 0) - 1
          };
        }
        return comment;
      })
    );
  };

  const handleComment = (commentText) => {
    const newComment = {
      id: Date.now(),
      user: {
        id: currentUser.id || 0,
        name: currentUser.name || 'You',
        username: currentUser.username || 'you',
        avatar: `https://ui-avatars.com/api/?name=${currentUser.name || 'You'}&background=6C63FF&color=fff&size=40`
      },
      text: commentText,
      createdAt: new Date(),
      likes: 0,
      isLiked: false
    };
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
    }
  };

  const handleSaveEdit = (updatedData) => {
    setPost({
      ...post,
      image: updatedData.image,
      description: updatedData.description,
      location: updatedData.location
    });
    setIsEditing(false);
    alert('Post updated successfully!');
  };

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      navigate('/home');
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

  if (!post) {
    return (
      <div className="post-page flex flex-col items-center justify-center min-h-[400px] text-center gap-4 p-8">
        <span className="not-found-icon">🔍</span>
        <h2 className="text-xl md:text-2xl">Post Not Found</h2>
        <p className="text-[color:var(--color-gray)]">
          The post you're looking for doesn't exist.
        </p>
        <Link
          to="/home"
          className="btn btn-primary px-5 py-2.5 text-sm rounded-full bg-[color:var(--color-primary)] text-white"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?.id === post.user.id;

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
          isLiked={isLiked}
          likesCount={likesCount}
          onLike={handleLike}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDeletePost}
          currentUser={currentUser}
        />

        <CommentSection
          comments={comments}
          onAddComment={handleComment}
          onDeleteComment={handleDeleteComment}
          onLikeComment={handleLikeComment}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default PostPage;