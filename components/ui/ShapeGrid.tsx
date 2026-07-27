"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right" | "diagonal";
type Shape = "square" | "hexagon" | "circle" | "triangle";
type Cell = { x: number; y: number };

type ShapeGridProps = {
  direction?: Direction;
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  shape?: Shape;
  hoverTrailAmount?: number;
  className?: string;
};

export function ShapeGrid({
  direction = "diagonal",
  speed = 0.25,
  borderColor = "rgba(63, 97, 82, 0.12)",
  squareSize = 64,
  hoverFillColor = "rgba(63, 97, 82, 0.08)",
  shape = "square",
  hoverTrailAmount = 0,
  className = "",
}: ShapeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef<Cell | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const trailCells = useRef<Cell[]>([]);
  const cellOpacities = useRef(new Map<string, number>());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const isHex = shape === "hexagon";
    const isTri = shape === "triangle";
    const hexHoriz = squareSize * 1.5;
    const hexVert = squareSize * Math.sqrt(3);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resizeCanvas = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawHex = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const vx = cx + size * Math.cos(angle);
        const vy = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    const drawCircle = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.closePath();
    };

    const drawTriangle = (cx: number, cy: number, size: number, flip: boolean) => {
      ctx.beginPath();
      if (flip) {
        ctx.moveTo(cx, cy + size / 2);
        ctx.lineTo(cx + size / 2, cy - size / 2);
        ctx.lineTo(cx - size / 2, cy - size / 2);
      } else {
        ctx.moveTo(cx, cy - size / 2);
        ctx.lineTo(cx + size / 2, cy + size / 2);
        ctx.lineTo(cx - size / 2, cy + size / 2);
      }
      ctx.closePath();
    };

    /** Cell under the pointer, in the same coordinate space the draw loop uses
     *  (the grid scrolls, so the offset has to come back out). */
    const cellAt = (px: number, py: number): Cell => {
      if (isHex) {
        const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
        const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert;
        const col = Math.round((px - offsetX) / hexHoriz);
        const colShift = Math.floor(gridOffset.current.x / hexHoriz);
        const rowShift = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
        return { x: col, y: Math.round((py - offsetY - rowShift) / hexVert) };
      }
      const unitX = isTri ? squareSize / 2 : squareSize;
      const offsetX = ((gridOffset.current.x % unitX) + unitX) % unitX;
      const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;
      return {
        x: Math.floor((px - offsetX) / unitX),
        y: Math.floor((py - offsetY) / squareSize),
      };
    };

    const updateCellOpacities = () => {
      if (pointer.current) {
        const cell = cellAt(pointer.current.x, pointer.current.y);
        const prev = hoveredSquare.current;
        if (!prev || prev.x !== cell.x || prev.y !== cell.y) {
          if (prev && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...prev });
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount;
          }
          hoveredSquare.current = cell;
        }
      } else {
        hoveredSquare.current = null;
      }

      const targets = new Map<string, number>();

      if (hoveredSquare.current) {
        targets.set(`${hoveredSquare.current.x},${hoveredSquare.current.y}`, 1);
      }

      if (hoverTrailAmount > 0) {
        trailCells.current.forEach((cell, index) => {
          const key = `${cell.x},${cell.y}`;
          if (!targets.has(key)) targets.set(key, (trailCells.current.length - index) / (trailCells.current.length + 1));
        });
      }

      targets.forEach((_, key) => {
        if (!cellOpacities.current.has(key)) cellOpacities.current.set(key, 0);
      });

      cellOpacities.current.forEach((opacity, key) => {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;
        if (next < 0.005) cellOpacities.current.delete(key);
        else cellOpacities.current.set(key, next);
      });
    };

    const drawGrid = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz);
        const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
        const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert;
        const cols = Math.ceil(width / hexHoriz) + 3;
        const rows = Math.ceil(height / hexVert) + 3;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + offsetX;
            const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY;
            const alpha = cellOpacities.current.get(`${col},${row}`);
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawHex(cx, cy, squareSize);
              ctx.fillStyle = hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
            drawHex(cx, cy, squareSize);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          }
        }
        return;
      }

      const unitX = isTri ? squareSize / 2 : squareSize;
      const unitY = isTri ? squareSize : squareSize;
      const offsetX = ((gridOffset.current.x % unitX) + unitX) % unitX;
      const offsetY = ((gridOffset.current.y % unitY) + unitY) % unitY;
      const cols = Math.ceil(width / unitX) + 4;
      const rows = Math.ceil(height / unitY) + 4;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const x = col * unitX + offsetX;
          const y = row * unitY + offsetY;
          const alpha = cellOpacities.current.get(`${col},${row}`);

          if (shape === "circle") {
            const cx = x + squareSize / 2;
            const cy = y + squareSize / 2;
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawCircle(cx, cy, squareSize);
              ctx.fillStyle = hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
            drawCircle(cx, cy, squareSize);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          } else if (isTri) {
            const flip = (col + row) % 2 !== 0;
            const cx = x;
            const cy = y + squareSize / 2;
            if (alpha) {
              ctx.globalAlpha = alpha;
              drawTriangle(cx, cy, squareSize, flip);
              ctx.fillStyle = hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
            drawTriangle(cx, cy, squareSize, flip);
            ctx.strokeStyle = borderColor;
            ctx.stroke();
          } else {
            if (alpha) {
              ctx.globalAlpha = alpha;
              ctx.fillStyle = hoverFillColor;
              ctx.fillRect(x, y, squareSize, squareSize);
              ctx.globalAlpha = 1;
            }
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(x, y, squareSize, squareSize);
          }
        }
      }
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      const wrapX = isHex ? hexHoriz * 2 : isTri ? squareSize / 2 : squareSize;
      const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize;

      if (direction === "right") gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + wrapX) % wrapX;
      if (direction === "left") gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + wrapX) % wrapX;
      if (direction === "up") gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + wrapY) % wrapY;
      if (direction === "down") gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + wrapY) % wrapY;
      if (direction === "diagonal") {
        gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + wrapX) % wrapX;
        gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + wrapY) % wrapY;
      }

      updateCellOpacities();
      drawGrid();
      requestRef.current = reduce ? 0 : requestAnimationFrame(updateAnimation);
    };

    // The canvas is pointer-events-none (it sits over the whole page), so the
    // pointer is tracked on the window instead — hovering anything, anywhere,
    // still lights the cell underneath it.
    const staticFrame = () => {
      updateCellOpacities();
      drawGrid();
      requestRef.current = requestAnimationFrame(staticFrame);
    };

    // Pointer events, not mouse events: one handler covers mouse, pen, and
    // touch-drag, so the cell lights under a finger too.
    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      // Under reduced motion the loop is idle; wake it for the fade only.
      if (reduce && !requestRef.current) requestRef.current = requestAnimationFrame(staticFrame);
    };

    const handlePointerOut = (event: PointerEvent) => {
      // A finger lifting ends the hover; a mouse only when it leaves the window
      // (clearing on mouseup would kill the highlight on every click).
      const isMouse = event.pointerType === "mouse";
      if (event.type === "pointerleave" ? isMouse : !isMouse) pointer.current = null;
    };

    // A backgrounded tab should not be redrawing a full-viewport canvas. rAF is
    // usually throttled there, but not reliably across browsers, and this one
    // runs on every page for the life of the session.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = 0;
      } else if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(reduce ? staticFrame : updateAnimation);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerOut, { passive: true });
    window.addEventListener("pointercancel", handlePointerOut, { passive: true });
    document.addEventListener("pointerleave", handlePointerOut);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerOut);
      window.removeEventListener("pointercancel", handlePointerOut);
      document.removeEventListener("pointerleave", handlePointerOut);
      cancelAnimationFrame(requestRef.current);
    };
  }, [borderColor, direction, hoverFillColor, hoverTrailAmount, shape, speed, squareSize]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full border-0 ${className}`} />;
}

export default ShapeGrid;
