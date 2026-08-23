import {
  ArrowRightIcon,
  EraserIcon,
  HandIcon,
  PencilSimpleIcon,
  StickerIcon,
  TextTIcon,
} from "@phosphor-icons/react";
import "../App.css";
import { type tooltypes } from "../App";

// Define the Props type
interface ToolBarProps {
  toolactive: tooltypes;
  settoolactive: React.Dispatch<React.SetStateAction<tooltypes>>;
}

export const ToolBar = ({ toolactive, settoolactive }: ToolBarProps) => {
  const tooliconsize = 30;

  const toggleTool = (tool: tooltypes) => {
    settoolactive((prev) => (prev === tool ? "" : tool));
  };

  return (
    <div className="toolbar">
      <div className="toolbar-icon-container">
        <PencilSimpleIcon
          weight="duotone"
          className={`toolbar-icon ${toolactive === "pencil" ? "active" : ""}`}
          onClick={() => toggleTool("pencil")}
          size={tooliconsize}
        />
      </div>

      <div className="toolbar-icon-container">
        <EraserIcon
          weight="duotone"
          className={`toolbar-icon ${toolactive === "eraser" ? "active" : ""}`}
          size={tooliconsize}
          onClick={() => toggleTool("eraser")}
        />
      </div>

      <div className="toolbar-icon-container">
        <HandIcon
          weight="duotone"
          className={`toolbar-icon ${toolactive === "hand" ? "active" : ""}`}
          size={tooliconsize}
          onClick={() => toggleTool("hand")}
        />
      </div>

      <div className="toolbar-icon-container">
        <StickerIcon
          weight="duotone"
          className={`toolbar-icon ${toolactive === "stickie" ? "active" : ""}`}
          size={tooliconsize}
          onClick={() => toggleTool("stickie")}
        />
      </div>

      <div className="toolbar-icon-container">
        <TextTIcon
          weight="regular"
          className={`toolbar-icon ${toolactive === "text" ? "active" : ""}`}
          size={tooliconsize}
          onClick={() => toggleTool("text")}
        />
      </div>

      <div className="toolbar-icon-container">
        <ArrowRightIcon
          weight="duotone"
          className={`toolbar-icon ${toolactive === "arrow" ? "active" : ""}`}
          size={tooliconsize}
          onClick={() => toggleTool("arrow")}
        />
      </div>
    </div>
  );
};
