import { useRef, useState, useEffect, type PointerEvent } from "react";
import { getStroke } from "perfect-freehand";
import "../App.css";
import { type tooltypes } from "../App";

// 1. Update Line interfaces to retain the drawing intent
type Point = [number, number, number];
interface LineData {
  points: Point[];
  tool: "pencil" | "eraser";
  size: number;
}

function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc: (string | number)[], [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"],
  );
  d.push("Z");
  return d.join(" ");
}

export default function DrawingCanvas({
  canvasbg = "white",
  toolactive,
}: {
  canvasbg?: string;
  toolactive: tooltypes;
}) {
  const [pencilSize] = useState(6);
  const [eraserSize] = useState(30); // Give the eraser a wider tracking area

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // 2. Manage the canvas lifecycle through typed history logs
  const [lines, setLines] = useState<LineData[]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset layout layers
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Core render loop for historical paths
    lines.forEach((line) => {
      const stroke = getStroke(line.points, {
        size: line.size,
        thinning: 0.5,
        smoothing: 0.5,
      });
      const pathString = getSvgPathFromStroke(stroke);
      const path = new Path2D(pathString);

      if (line.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out"; // Turns strokes into clear masks
      } else {
        ctx.globalCompositeOperation = "source-over"; // Default drawing style
        ctx.fillStyle = "#000000";
      }
      ctx.fill(path);
    });

    // Render loop for active pointer movements
    if (currentLine.length > 0) {
      const activeSize = toolactive === "eraser" ? eraserSize : pencilSize;
      const stroke = getStroke(currentLine, {
        size: activeSize,
        thinning: 0.5,
        smoothing: 0.5,
      });
      const pathString = getSvgPathFromStroke(stroke);
      const path = new Path2D(pathString);

      if (toolactive === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#000000";
      }
      ctx.fill(path);
    }

    // Reset layer baseline defaults
    ctx.globalCompositeOperation = "source-over";
  }, [lines, currentLine, toolactive, pencilSize, eraserSize]);

  // Determine valid tool access
  const isActionableTool = toolactive === "pencil" || toolactive === "eraser";

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isActionableTool) return;

    setIsDrawing(true);
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCurrentLine([[e.clientX - rect.left, e.clientY - rect.top, e.pressure]]);
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isActionableTool) return;
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setCurrentLine((prev) => [
      ...prev,
      [e.clientX - rect.left, e.clientY - rect.top, e.pressure],
    ]);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    if (
      currentLine.length > 0 &&
      (toolactive === "pencil" || toolactive === "eraser")
    ) {
      setLines((prev) => [
        ...prev,
        {
          points: currentLine,
          tool: toolactive,
          size: toolactive === "eraser" ? eraserSize : pencilSize,
        },
      ]);
    }
    setCurrentLine([]);
  };

  // Dynamic system cursor styling based on choice of tool
  const getCursorStyle = () => {
    if (toolactive === "pencil") return "crosshair";
    if (toolactive === "eraser") return "cell"; // Gives a structural precision pointer
    return "default";
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      className="canvas-wrapper"
    >
      <canvas
        ref={canvasRef}
        width={1600}
        height={1100}
        style={{
          background: canvasbg,
          display: "block",
          cursor: getCursorStyle(),
        }}
        className="canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
}
