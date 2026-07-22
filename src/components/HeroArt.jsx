// Placeholder "photo accent" for the hero — a warm flat concert scene.
// Swap for a real photo any time: <img className="hero-art-svg" src="/your-photo.jpg" alt="" />
export default function HeroArt() {
  const dots = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) dots.push(<circle key={`${r}-${c}`} cx={306 + c * 15} cy={356 + r * 15} r={2.1} />);
  return (
    <div className="hero-art-frame">
      <svg viewBox="0 0 400 480" className="hero-art-svg" role="img" aria-label="Concert artwork placeholder">
        <rect x="0" y="0" width="400" height="480" fill="#2F6B5E" />
        <polygon points="60,0 148,0 118,300 30,300" fill="#F7F0E3" opacity="0.10" />
        <polygon points="340,0 252,0 282,300 370,300" fill="#F7F0E3" opacity="0.10" />
        <polygon points="182,0 224,0 236,330 164,330" fill="#E9A13B" opacity="0.22" />
        <circle cx="322" cy="66" r="30" fill="#E9A13B" />
        <g fill="#2B2118">
          <path d="M176 196 Q200 188 224 196 L232 412 L168 412 Z" />
          <circle cx="200" cy="162" r="29" />
          <rect x="178" y="360" width="16" height="70" rx="6" />
          <rect x="206" y="360" width="16" height="70" rx="6" />
        </g>
        <path d="M182 200 L150 150" stroke="#2B2118" strokeWidth="16" strokeLinecap="round" />
        <path d="M218 200 L242 252" stroke="#2B2118" strokeWidth="16" strokeLinecap="round" />
        <circle cx="148" cy="146" r="9" fill="#2B2118" />
        <path d="M0 430 q34 -34 68 0 q34 -34 68 0 q34 -34 68 0 q34 -34 68 0 q34 -34 68 0 q34 -34 68 0 L408 480 L0 480 Z" fill="#1E1710" />
        <g fill="#F7F0E3" opacity="0.45">{dots}</g>
      </svg>
      <span className="hero-art-tag">Tonight · Accra</span>
    </div>
  );
}
