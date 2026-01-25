interface GradientTextProps {
  text: string;
  className?: string;
}

export function GradientText({ text, className = "" }: GradientTextProps) {
  return <span className={`text-gradient font-bold ${className}`}>{text}</span>;
}
