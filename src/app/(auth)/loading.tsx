"use client";
import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  const override = {
    display: "block",
    margin: "0 auto",
  };
  const [color] = useState("#000000");

  return (
    <div className="mt-4 absolute right-6">
      <ClipLoader
        color={color}
        loading={true}
        cssOverride={override}
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
