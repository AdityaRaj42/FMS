/**
 * LoadingSkeleton — Premium animated loading states for NexusFM.
 * Variants: page, cards, grid, list
 */

const shimmerKeyframes = `
@keyframes nexus-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes nexus-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
@keyframes nexus-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

function injectStyles() {
  if (typeof document === "undefined") return;
  const id = "nexus-skeleton-styles";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = shimmerKeyframes;
    document.head.appendChild(style);
  }
}

const shimmerBg = {
  background: "linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(0,168,255,0.06) 50%, rgba(255,255,255,0.02) 75%)",
  backgroundSize: "200% 100%",
  animation: "nexus-shimmer 1.8s ease-in-out infinite",
  borderRadius: 6,
};

function SkeletonBar({ width = "100%", height = 12, style = {} }: { width?: string | number; height?: number; style?: React.CSSProperties }) {
  return <div style={{ ...shimmerBg, width, height, ...style }} />;
}

function SkeletonCard({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SkeletonBar width="60%" height={10} />
        <SkeletonBar width={26} height={26} style={{ borderRadius: 6 }} />
      </div>
      <SkeletonBar width="40%" height={28} />
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <SkeletonBar width={7} height={7} style={{ borderRadius: "50%" }} />
        <SkeletonBar width="50%" height={10} />
      </div>
      <SkeletonBar width="100%" height={32} />
    </div>
  );
}

function SkeletonListRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
        borderRadius: 6,
      }}
    >
      <SkeletonBar width={24} height={24} style={{ borderRadius: 5, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <SkeletonBar width="70%" height={11} />
        <SkeletonBar width="90%" height={9} />
      </div>
      <SkeletonBar width={40} height={14} style={{ borderRadius: 8 }} />
    </div>
  );
}

function NexusSpinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 40,
          height: 40,
          border: "2px solid rgba(0,168,255,0.15)",
          borderTopColor: "#00A8FF",
          borderRadius: "50%",
          animation: "nexus-spin 0.8s linear infinite",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#00A8FF",
            animation: "nexus-pulse 1.5s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: 11, color: "rgba(0,168,255,0.6)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Loading Data
        </span>
      </div>
    </div>
  );
}

export type SkeletonVariant = "page" | "cards" | "grid" | "list" | "heatmap" | "agents";

export function LoadingSkeleton({ variant = "page" }: { variant?: SkeletonVariant }) {
  injectStyles();

  if (variant === "cards") {
    return (
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} style={{ flex: 1 }} />
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, flex: 1 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} style={{ minHeight: 180 }} />
        ))}
      </div>
    );
  }

  if (variant === "list" || variant === "agents") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {Array.from({ length: variant === "agents" ? 6 : 5 }).map((_, i) => (
          <SkeletonListRow key={i} />
        ))}
      </div>
    );
  }

  if (variant === "heatmap") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, padding: 4 }}>
        <SkeletonBar width="50%" height={10} />
        <div style={{ display: "flex", gap: 3, paddingLeft: 56, marginTop: 4 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonBar key={i} width="100%" height={10} style={{ flex: 1 }} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, ri) => (
          <div key={ri} style={{ display: "flex", gap: 3, flex: 1 }}>
            <SkeletonBar width={50} height="100%" style={{ flexShrink: 0 }} />
            {Array.from({ length: 7 }).map((_, ci) => (
              <div
                key={ci}
                style={{
                  ...shimmerBg,
                  flex: 1,
                  minHeight: 24,
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // "page" — full page loading
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "12px 16px",
        overflow: "hidden",
      }}
    >
      {/* KPI strip skeleton */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} style={{ flex: 1 }} />
        ))}
      </div>

      {/* Main area skeleton */}
      <div style={{ flex: 1, display: "flex", gap: 10, minHeight: 0 }}>
        <div
          style={{
            flex: 1.5,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NexusSpinner />
        </div>
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 12,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonListRow key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
