import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "../components/Loader";

export const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAuthors();
  }, []);

  const getAuthors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/users`
      );
      setAuthors(response.data);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map((author) => {
            return (
              <Link
                to={`/posts/users/${author._id}`}
                key={author._id}
                className="author"
              >
                <div className="author__avatar">
                  <img
                    src={`${import.meta.env.VITE_ASSETS_URL}/uploads/${
                      author.avatar
                    }`}
                    alt=""
                  />
                </div>
                <div className="author__info">
                  <h4>{author.name}</h4>
                  <p>{author.posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No authors found.</h2>
      )}
    </section>
  );
};
