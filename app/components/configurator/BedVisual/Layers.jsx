// FabricLayer.jsx — mattress + fabric texture on the bed surface
export function FabricLayer({ colour, fabric, widthScale }) {
  const w = widthScale || 1.0;
  const left = 400 - 232 * w;
  const right = 400 + 232 * w;
  const hex = colour || "#3A3A3A";

  return (
    <g className="fabric-layer" style={{ transition: "opacity 350ms ease" }}>
      {/* Mattress surface */}
      <rect
        x={left}
        y={298}
        width={right - left}
        height={28}
        rx="3"
        fill={hex}
        opacity="0.9"
      />
      <rect
        x={left}
        y={298}
        width={right - left}
        height={28}
        rx="3"
        fill={`url(#texture-${fabric || "velvet"})`}
      />
      {/* Mattress top highlight */}
      <rect
        x={left + 2}
        y={298}
        width={right - left - 4}
        height="3"
        rx="1.5"
        fill="rgba(255,255,255,0.08)"
      />
      {/* Pillow pair */}
      <rect
        x={left + 20}
        y={270}
        width={(right - left) * 0.42}
        height="36"
        rx="10"
        fill={hex}
        opacity="0.85"
      />
      <rect
        x={left + 20}
        y={270}
        width={(right - left) * 0.42}
        height="36"
        rx="10"
        fill={`url(#texture-${fabric || "velvet"})`}
      />
      <rect
        x={right - 20 - (right - left) * 0.42}
        y={270}
        width={(right - left) * 0.42}
        height="36"
        rx="10"
        fill={hex}
        opacity="0.85"
      />
      <rect
        x={right - 20 - (right - left) * 0.42}
        y={270}
        width={(right - left) * 0.42}
        height="36"
        rx="10"
        fill={`url(#texture-${fabric || "velvet"})`}
      />
      {/* Pillow highlights */}
      <rect
        x={left + 22}
        y={272}
        width={(right - left) * 0.38}
        height="6"
        rx="3"
        fill="rgba(255,255,255,0.06)"
      />
    </g>
  );
}

// LegsLayer.jsx — leg style rendering
export function LegsLayer({ legs, widthScale }) {
  const w = widthScale || 1.0;
  const left = 400 - 228 * w;
  const right = 400 + 228 * w;

  const legColour =
    {
      chrome: "#C8C8C8",
      gold: "#C9A96E",
      wooden: "#8B6914",
    }[legs] || "#C8C8C8";

  const legGlow =
    {
      chrome: "rgba(200,200,200,0.3)",
      gold: "rgba(201,169,110,0.4)",
      wooden: "rgba(139,105,20,0.3)",
    }[legs] || "rgba(200,200,200,0.3)";

  if (!legs || legs === "none") return null;

  return (
    <g className="legs-layer">
      {/* Front left leg */}
      <rect
        x={left + 10}
        y={428}
        width="14"
        height="28"
        rx="3"
        fill={legColour}
      />
      <rect x={left + 11} y={428} width="4" height="28" rx="2" fill={legGlow} />
      {/* Front right leg */}
      <rect
        x={right - 24}
        y={428}
        width="14"
        height="28"
        rx="3"
        fill={legColour}
      />
      <rect
        x={right - 23}
        y={428}
        width="4"
        height="28"
        rx="2"
        fill={legGlow}
      />
    </g>
  );
}

// StorageLayer.jsx — ottoman cavity or drawer lines
export function StorageLayer({ style, storage }) {
  if (style !== "divan" && style !== "ottoman") return null;
  if (!storage || storage === "none") return null;

  if (style === "ottoman" || storage === "ottoman-lift") {
    return (
      <g className="storage-layer">
        {/* Ottoman lift indicator — subtle line showing the lift mechanism */}
        <line
          x1="178"
          y1="342"
          x2="622"
          y2="342"
          stroke="rgba(201,169,110,0.25)"
          strokeWidth="1.5"
          strokeDasharray="6,4"
        />
        <text
          x="400"
          y="358"
          textAnchor="middle"
          fontSize="9"
          fill="rgba(201,169,110,0.4)"
          fontFamily="system-ui"
          letterSpacing="0.1em"
        >
          LIFT-UP STORAGE
        </text>
      </g>
    );
  }

  if (storage === "2-drawer") {
    return (
      <g className="storage-layer">
        <line
          x1="178"
          y1="375"
          x2="622"
          y2="375"
          stroke="rgba(201,169,110,0.15)"
          strokeWidth="1"
        />
        {/* Left drawer handle */}
        <rect
          x="240"
          y="368"
          width="30"
          height="5"
          rx="2.5"
          fill="rgba(201,169,110,0.3)"
        />
        {/* Right drawer handle */}
        <rect
          x="530"
          y="368"
          width="30"
          height="5"
          rx="2.5"
          fill="rgba(201,169,110,0.3)"
        />
        <text
          x="400"
          y="395"
          textAnchor="middle"
          fontSize="9"
          fill="rgba(201,169,110,0.35)"
          fontFamily="system-ui"
          letterSpacing="0.1em"
        >
          2 DRAWERS
        </text>
      </g>
    );
  }

  if (storage === "4-drawer") {
    return (
      <g className="storage-layer">
        <line
          x1="178"
          y1="365"
          x2="622"
          y2="365"
          stroke="rgba(201,169,110,0.15)"
          strokeWidth="1"
        />
        <line
          x1="400"
          y1="325"
          x2="400"
          y2="430"
          stroke="rgba(201,169,110,0.1)"
          strokeWidth="1"
        />
        {/* 4 drawer handles */}
        <rect
          x="210"
          y="358"
          width="24"
          height="4"
          rx="2"
          fill="rgba(201,169,110,0.3)"
        />
        <rect
          x="360"
          y="358"
          width="24"
          height="4"
          rx="2"
          fill="rgba(201,169,110,0.3)"
        />
        <rect
          x="210"
          y="388"
          width="24"
          height="4"
          rx="2"
          fill="rgba(201,169,110,0.3)"
        />
        <rect
          x="360"
          y="388"
          width="24"
          height="4"
          rx="2"
          fill="rgba(201,169,110,0.3)"
        />
        <text
          x="400"
          y="415"
          textAnchor="middle"
          fontSize="9"
          fill="rgba(201,169,110,0.35)"
          fontFamily="system-ui"
          letterSpacing="0.1em"
        >
          4 DRAWERS
        </text>
      </g>
    );
  }

  return null;
}

// AddonsLayer.jsx — togglable addon visuals
export function AddonsLayer({ addons, widthScale, colour }) {
  const w = widthScale || 1.0;
  const left = 400 - 240 * w;
  const right = 400 + 240 * w;

  if (!addons || addons.length === 0) return null;

  return (
    <g className="addons-layer">
      {/* LED strip — glowing line at base of headboard */}
      {addons.includes("led-strip") && (
        <g>
          <line
            x1={left + 10}
            y1={314}
            x2={right - 10}
            y2={314}
            stroke="rgba(201,169,110,0.6)"
            strokeWidth="2"
          />
          <line
            x1={left + 10}
            y1={314}
            x2={right - 10}
            y2={314}
            stroke="rgba(201,169,110,0.2)"
            strokeWidth="8"
            style={{ filter: "blur(3px)" }}
          />
        </g>
      )}

      {/* USB ports — small indicator on headboard side */}
      {addons.includes("usb-ports") && (
        <g>
          <rect
            x={right - 28}
            y={290}
            width="12"
            height="7"
            rx="1.5"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
          <rect
            x={right - 14}
            y={290}
            width="12"
            height="7"
            rx="1.5"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        </g>
      )}

      {/* Diamond buttoning — subtle indicator dot pattern on headboard */}
      {addons.includes("diamond-buttoning") && (
        <g opacity="0.6">
          {[340, 370, 400, 430, 460].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy={160} r="3" fill="rgba(0,0,0,0.3)" />
              <circle cx={cx} cy={160} r="1.5" fill="rgba(0,0,0,0.5)" />
            </g>
          ))}
          {[355, 385, 415, 445].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy={190} r="3" fill="rgba(0,0,0,0.3)" />
              <circle cx={cx} cy={190} r="1.5" fill="rgba(0,0,0,0.5)" />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

// DimensionsLayer.jsx — size label at bottom
export function DimensionsLayer({ size }) {
  const labels = {
    single: "90 × 190 cm",
    "small-double": "120 × 190 cm",
    double: "135 × 190 cm",
    king: "150 × 200 cm",
    "super-king": "180 × 200 cm",
  };
  const label = labels[size] || "";

  if (!size) return null;

  return (
    <g className="dimensions-layer">
      {/* Subtle dimension line */}
      <line
        x1="120"
        y1="450"
        x2="680"
        y2="450"
        stroke="rgba(201,169,110,0.12)"
        strokeWidth="1"
      />
      <line
        x1="120"
        y1="445"
        x2="120"
        y2="455"
        stroke="rgba(201,169,110,0.2)"
        strokeWidth="1"
      />
      <line
        x1="680"
        y1="445"
        x2="680"
        y2="455"
        stroke="rgba(201,169,110,0.2)"
        strokeWidth="1"
      />
      <text
        x="400"
        y="472"
        textAnchor="middle"
        fontSize="11"
        fill="rgba(201,169,110,0.45)"
        fontFamily="system-ui"
        letterSpacing="0.15em"
      >
        {label}
      </text>
    </g>
  );
}
