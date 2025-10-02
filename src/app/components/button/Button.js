import React from "react";
import { Tooltip } from "react-tooltip";

function Button({
  content,
  style,
  fn,
  tooltipContent,
  tooltipId,
  highlighted,
  disabled,
}) {
  const handleClick = (e) => {
    fn(content, e);
  };

  const setButtonStyle = () => {
    // let styleToSet = "border-gray-300 py-3 px-2";
    let styleToSet = "border-none py-3 px-2";
    switch (style) {
      case "classicButton":
        styleToSet += " shadow-sm bg-stone-200 rounded font-normal";
        break;
      case "classicButton-s":
        styleToSet = "p-1 shadow-sm bg-stone-200 rounded font-normal";
        break;
      case "smallButton":
        styleToSet += " border-b";
        break;
      case "warnButton":
        styleToSet = "p-2";
        break;
      case "wideButton":
        styleToSet += " rounded w-full flex justify-center";
        break;
      case "menuPoint":
        styleToSet =
          "border-gray-300 border-b w-full !h-11 flex pl-3 items-center";
        break;
      case "iconButton":
        styleToSet = "p-1 rounded";
        break;
      case "iconButton-l":
        styleToSet = "p-1 rounded text-xl";
        break;
      case "tabButton":
        styleToSet += " rounded text-nowrap";
        break;
      case "imageButton":
        styleToSet = "";
        break;
    }

    styleToSet += " select-none";

    return styleToSet;
  };

  const setButtonStyleHover = () => {
    let styleToSet =
      "hover:bg-[#b92531] hover:text-white hover:shadow-sm active:bg-orange-600 cursor-pointer";

    if (disabled) {
      styleToSet = "cursor-not-allowed";
    }

    if (style === "warnButton") {
      styleToSet = "";
    }

    if (style === "menuPoint") {
      styleToSet += " hover:font-medium";
    }

    if (style === "tabButton") {
      styleToSet =
        "hover:bg-[#ff919b] hover:text-white hover:shadow-sm active:bg-orange-600 cursor-pointer";
    }

    if (style === "imageButton") {
      styleToSet = "cursor-pointer";
    }

    return styleToSet;
  };

  const setButtonStyleHighlighted = () => {
    let styleToSet =
      " !bg-[#b92531] hover:!bg-[#b92531] text-white font-medium ";

    if (highlighted) {
      return styleToSet;
    } else {
      return "";
    }
  };

  return (
    <div
      className={`leading-none w-fit h-fit ${setButtonStyle()} ${setButtonStyleHover()} ${setButtonStyleHighlighted()}`}
      onClick={!disabled ? (fn ? handleClick : null) : null}
      data-tooltip-id={tooltipId}
      data-tooltip-hidden={!tooltipContent}
    >
      {content}
      <Tooltip
        id={tooltipId}
        openEvents={{ mouseenter: true, focus: true, click: true }}
        style={{ maxWidth: "90%", zIndex: 20 }}
      >
        {tooltipContent}
      </Tooltip>
    </div>
  );
}

export default Button;
