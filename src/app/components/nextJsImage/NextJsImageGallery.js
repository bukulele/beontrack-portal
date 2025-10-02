"use client";

import Image from "next/image";
import "react-photo-album/rows.css";

function renderNextImage({ alt = "", title, sizes }, { photo, width, height }) {
  return (
    <div
      style={{
        width: "auto",
        maxWidth: "250px",
        height: "auto",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photo}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder={photo.blurDataURL ? "blur" : undefined}
      />
    </div>
  );
}

export default renderNextImage;
