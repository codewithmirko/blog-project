import React from "react";
import LoadingGif from "../assets/loading.gif";

export const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__image">
        <img src={LoadingGif} alt="" />
      </div>
    </div>
  );
};
