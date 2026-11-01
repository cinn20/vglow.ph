export function StarRating({
  rating,
  size = 13,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span
      className={`inline-flex items-center gap-[3px] ${className}`}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      role="img"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = rounded >= star ? 1 : rounded >= star - 0.5 ? 0.5 : 0;
        return (
          <span key={star} className="relative inline-block" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              viewBox="0 0 20 20"
              className="absolute inset-0 text-ink/15"
              fill="currentColor"
              aria-hidden
            >
              <path d="M10 1.6l2.47 5.4 5.9.66-4.4 4 1.2 5.84L10 14.6l-5.17 2.9 1.2-5.84-4.4-4 5.9-.66L10 1.6Z" />
            </svg>
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <svg
                  width={size}
                  height={size}
                  viewBox="0 0 20 20"
                  className="text-gold"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M10 1.6l2.47 5.4 5.9.66-4.4 4 1.2 5.84L10 14.6l-5.17 2.9 1.2-5.84-4.4-4 5.9-.66L10 1.6Z" />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
