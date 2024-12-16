"use client";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const loading = () => {
  const override = {
    display: "block",
    margin: "0 auto",
  };

  return (
    <div className=" mt-4 absolute right-6">
      <ClipLoader
        color={"black"}
        loading={true}
        cssOverride={override}
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default loading;
