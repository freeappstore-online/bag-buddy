interface BuddyMascotProps {
  size?: number;
  happy?: boolean;
  style?: React.CSSProperties;
}

export function BuddyMascot({ size = 64, happy = false, style }: BuddyMascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      {/* Bag body */}
      <rect x="20" y="50" width="80" height="75" rx="18" fill="#6366f1" />
      {/* Bag front pocket */}
      <rect x="35" y="90" width="50" height="28" rx="10" fill="#818cf8" />
      {/* Pocket zipper */}
      <line x1="60" y1="90" x2="60" y2="118" stroke="#4f46e5" strokeWidth="2" strokeDasharray="3,3" />
      <circle cx="60" cy="90" r="3" fill="#4f46e5" />
      {/* Bag strap left */}
      <path d="M30 50 Q22 30 35 20" stroke="#4f46e5" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Bag strap right */}
      <path d="M90 50 Q98 30 85 20" stroke="#4f46e5" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Top handle */}
      <rect x="45" y="42" width="30" height="10" rx="5" fill="#4f46e5" />

      {/* Face area */}
      <ellipse cx="60" cy="68" rx="26" ry="22" fill="#e0e7ff" />

      {/* Eyes */}
      <circle cx="50" cy="64" r="5" fill="white" />
      <circle cx="70" cy="64" r="5" fill="white" />
      <circle cx={happy ? 51 : 50} cy={happy ? 63 : 64} r="3" fill="#312e81" />
      <circle cx={happy ? 71 : 70} cy={happy ? 63 : 64} r="3" fill="#312e81" />
      {/* Eye shine */}
      <circle cx="52" cy="62" r="1" fill="white" />
      <circle cx="72" cy="62" r="1" fill="white" />

      {/* Mouth */}
      {happy ? (
        <path d="M50 74 Q60 82 70 74" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M50 75 Q60 80 70 75" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* Cheeks */}
      {happy && (
        <>
          <ellipse cx="44" cy="72" rx="5" ry="3" fill="#f9a8d4" opacity="0.7" />
          <ellipse cx="76" cy="72" rx="5" ry="3" fill="#f9a8d4" opacity="0.7" />
        </>
      )}

      {/* Stars when happy */}
      {happy && (
        <>
          <text x="5" y="30" fontSize="14" fill="#fbbf24">⭐</text>
          <text x="95" y="30" fontSize="14" fill="#fbbf24">✨</text>
        </>
      )}
    </svg>
  );
}
