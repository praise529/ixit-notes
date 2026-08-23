import { useState, useEffect } from "react";
import "./App.css";
import DrawingCanvas from "./components/drawingcanvas";
import { ToolBar } from "./components/toolbar";
import Stickie from "./components/stickie";

export type tooltypes =
  | "pencil"
  | "eraser"
  | "hand"
  | "stickie"
  | "text"
  | "arrow"
  | "";

function App() {
  const [toolactive, settoolactive] = useState<tooltypes>(() => {
    const saved = localStorage.getItem("toolactive");
    return (saved as tooltypes) || "pencil";
  });

  useEffect(() => {
    localStorage.setItem("toolactive", toolactive);
  }, [toolactive]);

  return (
    <>
      <div>
        {/* <Stickie /> */}
        <DrawingCanvas toolactive={toolactive} />
      </div>
      <ToolBar toolactive={toolactive} settoolactive={settoolactive} />
    </>
  );
}

export default App;
