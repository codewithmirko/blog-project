import React from "react";
import { PostAuthor } from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Thumbnail from "../assets/thumbnail.jpg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { DeletePost } from "./DeletePost";
import { Loader } from "../components/Loader";
import axios from "axios";

export const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/posts/${id}`
      );
      setPost(response.data);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && (
        <div className="container post-detail__container">
          <div className="post-detail__header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id == post?.creator && (
              <div className="post-detail__buttons">
                <Link
                  to={`/posts/${post?._id}/edit`}
                  className="btn sm primary "
                >
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail__thumbnail">
            <img
              src={`${import.meta.env.VITE_ASSETS_URL}/uploads/${
                post.thumbnail
              }`}
              alt=""
            />
          </div>
          <p>{post.body.substr(3, post.body.length - 7)}</p>
        </div>
      )}
    </section>
  );
};
