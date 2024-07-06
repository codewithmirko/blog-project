import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <section className="error-page">
      <div className="center">
        <Link to="/" className="btn primary">
          Go back Home
        </Link>
        <h2>Page not found</h2>
      </div>
    </section>
  );
};
