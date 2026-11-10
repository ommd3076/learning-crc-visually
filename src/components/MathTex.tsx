import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { COLORS } from "../styles/colors";

export interface MathTexProps {
  math: string;
  style?: React.CSSProperties;
  color?: string;
  fontSize?: number;
}

export const MathTex: React.FC<MathTexProps> = ({
  math,
  style,
  color = COLORS.textWhite,
  fontSize = 38,
}) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (e) {
      return math;
    }
  }, [math]);

  return (
    <div
      style={{
        color,
        fontSize,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "12px 0",
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const MathInline: React.FC<MathTexProps> = ({
  math,
  style,
  color = COLORS.textWhite,
  fontSize = 28,
}) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (e) {
      return math;
    }
  }, [math]);

  return (
    <span
      style={{
        color,
        fontSize,
        display: "inline-block",
        verticalAlign: "middle",
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const GrantTitle: React.FC<{
  title: string;
  subtitle?: string;
  style?: React.CSSProperties;
}> = ({ title, subtitle, style }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginBottom: 36,
        ...style,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 52,
          fontWeight: 400,
          color: COLORS.textWhite,
          letterSpacing: "-0.01em",
          fontFamily: "'KaTeX_Main', 'Computer Modern', 'Times New Roman', serif",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: "10px 0 0 0",
            fontSize: 24,
            fontWeight: 300,
            color: COLORS.textMuted,
            fontFamily: "'KaTeX_Main', 'Computer Modern', 'Times New Roman', serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
