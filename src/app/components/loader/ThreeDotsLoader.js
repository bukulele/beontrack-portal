import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { useLoader } from "@/app/context/LoaderContext";

function ThreeDotsLoader() {
  const { isLoading } = useLoader();

  return (
    isLoading && (
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#878787"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{
          position: "fixed",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "20",
        }}
        wrapperClass=""
      />
    )
  );
}

export default ThreeDotsLoader;
