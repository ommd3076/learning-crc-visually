import React from "react";
import { COLORS } from "../styles/colors";

export interface VoidCanvasProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const VoidCanvas: React.FC<VoidCanvasProps> = ({ children, style }) => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: COLORS.canvas,
        color: COLORS.textWhite,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "60px 100px",
        fontFamily: "'Computer Modern', 'KaTeX_Main', 'Latin Modern Roman', 'Times New Roman', serif",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
