import React from "react";
import { Link } from "react-router-dom";
import { PostAuthor } from "./PostAuthor";

export const PostItem = ({
  postID,
  category,
  title,
  body,
  authorID,
  thumbnail,
  createdAt,
}) => {
  const shortBody =
    body.length > 145
      ? body.substr(3, 145) + "..."
      : body.substr(3, body.length - 7);
  const postTitle = title.length > 30 ? title.substr(0, 30) + "..." : title;

  console.log(thumbnail);
  return (
    <article className="post">
      <div className="post__thumbnail">
        <img
          src={`${import.meta.env.VITE_ASSETS_URL}/uploads/${thumbnail}`}
          alt={title}
        />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p>{shortBody}</p>
        {console.log(shortBody)}
        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};
