import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage.jsx";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { PostDetail } from "./pages/PostDetail.jsx";
import { SignUp } from "./pages/SignUp.jsx";
import { Login } from "./pages/Login.jsx";
import { UserProfile } from "./pages/UserProfile.jsx";
import { CreatePost } from "./pages/CreatePost.jsx";
import { EditPost } from "./pages/EditPost.jsx";
import { DeletePost } from "./pages/DeletePost.jsx";
import { CategoryPosts } from "./pages/CategoryPosts.jsx";
import { AuthorPosts } from "./pages/AuthorPosts.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Logout } from "./pages/Logout.jsx";
import { Authors } from "./pages/Authors.jsx";
import UserProvider from "./context/userContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "register", element: <SignUp /> },
      { path: "login", element: <Login /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "authors", element: <Authors /> },
      { path: "create", element: <CreatePost /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "posts/:id/delete", element: <DeletePost /> },
      { path: "logout", element: <Logout /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
