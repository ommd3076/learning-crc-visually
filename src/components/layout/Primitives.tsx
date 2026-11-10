import React from "react";
import { THEME } from "../../styles/theme";

interface SceneContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({ children, style }) => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: THEME.colors.bgDark,
        color: THEME.colors.textPrimary,
        fontFamily: THEME.fonts.sans,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        padding: "60px 80px",
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 85% 80%, rgba(250, 204, 21, 0.04) 0%, transparent 40%)
        `,
        ...style,
      }}
    >
      {/* 3B1B delicate grid coordinate background */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.12,
        }}
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {children}
    </div>
  );
};

interface HeaderBannerProps {
  sceneNumber: number | string;
  category: string;
  title: string;
  subtitle?: string;
  progress?: number; // 0 to 1
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  sceneNumber,
  category,
  title,
  subtitle,
  progress = 1,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 36,
        borderBottom: `1px solid ${THEME.colors.borderSubtle}`,
        paddingBottom: 24,
        position: "relative",
        zIndex: 10,
        opacity: Math.min(1, progress * 1.5),
        transform: `translateY(${(1 - progress) * -15}px)`,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontSize: 14,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              color: THEME.colors.cyan,
              border: `1px solid rgba(56, 189, 248, 0.3)`,
              fontWeight: 700,
            }}
          >
            ACT {sceneNumber} : {category}
          </span>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontSize: 13,
              color: THEME.colors.textMuted,
              letterSpacing: "0.08em",
            }}
          >
            CRC-16 / CCITT • GF(2) POLYNOMIAL RING
          </span>
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: THEME.colors.textPrimary,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: 18,
              color: THEME.colors.textSecondary,
              fontFamily: THEME.fonts.sans,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: 12,
            color: THEME.colors.textMuted,
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          ALGEBRAIC REASONING
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: THEME.colors.emerald }} />
          <span style={{ fontFamily: THEME.fonts.mono, fontSize: 13, color: THEME.colors.textSecondary }}>
            1080p • 30fps Synchronized
          </span>
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: "cyan" | "gold" | "emerald" | "coral" | "none";
  borderColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  glow = "none",
  borderColor = THEME.colors.borderSubtle,
}) => {
  const getGlow = () => {
    switch (glow) {
      case "cyan":
        return THEME.shadows.glowCyan;
      case "gold":
        return THEME.shadows.glowGold;
      case "emerald":
        return THEME.shadows.glowEmerald;
      case "coral":
        return THEME.shadows.glowCoral;
      default:
        return THEME.shadows.card;
    }
  };

  return (
    <div
      style={{
        backgroundColor: THEME.colors.bgCard,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        padding: "24px 28px",
        boxShadow: getGlow(),
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  label: string;
  variant?: "cyan" | "gold" | "emerald" | "coral" | "neutral";
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = "cyan", style }) => {
  const colorMap = {
    cyan: { bg: "rgba(56, 189, 248, 0.14)", text: THEME.colors.cyan, border: "rgba(56, 189, 248, 0.3)" },
    gold: { bg: "rgba(250, 204, 21, 0.14)", text: THEME.colors.gold, border: "rgba(250, 204, 21, 0.3)" },
    emerald: { bg: "rgba(34, 197, 94, 0.14)", text: THEME.colors.emerald, border: "rgba(34, 197, 94, 0.3)" },
    coral: { bg: "rgba(239, 68, 68, 0.14)", text: THEME.colors.coral, border: "rgba(239, 68, 68, 0.3)" },
    neutral: { bg: "rgba(148, 163, 184, 0.12)", text: THEME.colors.textSecondary, border: THEME.colors.borderSubtle },
  };

  const current = colorMap[variant];

  return (
    <span
      style={{
        fontFamily: THEME.fonts.mono,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        padding: "3px 10px",
        borderRadius: 6,
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        display: "inline-flex",
        alignItems: "center",
        ...style,
      }}
    >
      {label}
    </span>
  );
};

interface FormulaBoxProps {
  formula: string;
  label?: string;
  color?: string;
  style?: React.CSSProperties;
}

export const FormulaBox: React.FC<FormulaBoxProps> = ({
  formula,
  label,
  color = THEME.colors.cyan,
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        border: `1px solid ${THEME.colors.borderSubtle}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        padding: "14px 20px",
        fontFamily: THEME.fonts.mono,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 11,
            color: THEME.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ fontSize: 22, color: THEME.colors.textPrimary, fontWeight: 600 }}>
        {formula}
      </div>
    </div>
  );
};
