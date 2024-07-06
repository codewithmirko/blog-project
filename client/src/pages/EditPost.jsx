import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext, useEffect } from "react";
import axios from "axios";

export const EditPost = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  //redirect to login for any user who is not logged in

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [body, setBody] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST_CATEGORIES = [
    "Agriculture",
    "Business",
    "Education",
    "Entertainment",
    "Art",
    "Investment",
    "Uncategorized",
    "Weather",
  ];

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/posts/${id}`
      );

      setTitle(response.data.title);
      setBody(response.data.body);
    } catch (error) {
      console.log(error);
    }
  };

  const editPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("body", body);
    postData.set("thumbnail", thumbnail);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_API_URL}/posts/${id}`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status == 200) {
        return navigate("/");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form action="" className="form create-post__form" onSubmit={editPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {POST_CATEGORIES.map((category) => {
              return <option key={category}>{category}</option>;
            })}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={body}
            onChange={setBody}
          />
          <input
            type="file"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
            }}
            accept="png, jpg, jpeg"
          />
          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};
