// A large, faint decorative emblem used as a background watermark across
// the site — an abstract "holocron" (nested diamond/gem inside a ring),
// echoing the site's name. Purely decorative: aria-hidden, no data.
export default function Watermark({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="100" cy="100" r="92" />
        <circle cx="100" cy="100" r="78" />
        <rect x="45" y="45" width="110" height="110" transform="rotate(45 100 100)" />
        <rect x="65" y="65" width="70" height="70" transform="rotate(45 100 100)" />
        <path d="M100 8 L100 28 M100 172 L100 192 M8 100 L28 100 M172 100 L192 100" />
      </g>
    </svg>
  );
}
