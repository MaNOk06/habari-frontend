// A convincing QR from a seed. The REAL ticket QR (spec section 7) is signed
// server-side with Ticket ID + Event ID + a signature so it can't be forged.
export default function QRCode({ seed, size = 118, id }) {
  const n = 21;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const cells = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!isFinder(r, c) && rand() > 0.55) cells.push([r, c]);
  const u = size / n;
  const Finder = ({ x, y }) => (
    <g><rect x={x*u} y={y*u} width={7*u} height={7*u} fill="#17150F" /><rect x={(x+1)*u} y={(y+1)*u} width={5*u} height={5*u} fill="#fff" /><rect x={(x+2)*u} y={(y+2)*u} width={3*u} height={3*u} fill="#17150F" /></g>
  );
  return (
    <svg id={id} width={size} height={size} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" role="img" aria-label="QR code">
      <rect width={size} height={size} fill="#fff" />
      {cells.map(([r, c], i) => <rect key={i} x={c*u} y={r*u} width={u} height={u} fill="#17150F" />)}
      <Finder x={0} y={0} /><Finder x={n-7} y={0} /><Finder x={0} y={n-7} />
    </svg>
  );
}
