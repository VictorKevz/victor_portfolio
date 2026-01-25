import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MemoryIcon from "@mui/icons-material/Memory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CodeIcon from "@mui/icons-material/Code";

interface BadgeWrapperProps {
  title: string;
  items: string[];
  className?: string;
}

const badgeIcons = [
  { Icon: WorkOutlineIcon, gradient: "gradient-primary" },
  { Icon: MemoryIcon, gradient: "gradient-secondary" },
  { Icon: TrendingUpIcon, gradient: "gradient-primary" },
  { Icon: CodeIcon, gradient: "gradient-secondary" },
];

export function BadgeWrapper({
  title,
  items,
  className = "",
}: BadgeWrapperProps) {
  return (
    <article
      className={`w-full max-w-sm rounded-3xl surface-glass backdrop-blur-2xl backdrop-brightness-60 backdrop-saturate-150  ${className}`}
    >
      <header className="w-full p-5 bg-(--surface-card-dark)! rounded-t-3xl border-b border-(--border-light)">
        <h2 className="text-xl font-semibold uppercase tracking-[0.2em] heading-text-light">
          {title}
        </h2>
      </header>

      <ul className="mt-4 flex flex-col gap-4 px-5 pb-5">
        {items.map((item, index) => {
          const { Icon, gradient } = badgeIcons[index] ?? badgeIcons[0];
          return (
            <li
              key={`${item}-${index}`}
              className="flex items-center gap-3 text-sm body-text-light"
            >
              <span
                className="relative p-px rounded-lg flex items-center justify-center overflow-hidden"
                style={{ background: `var(--${gradient})` }}
              >
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-(--neutral-0)/80"
                >
                  <Icon
                    className="text-on-primary body-text-dark"
                    fontSize="medium"
                  />
                </span>
              </span>
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
