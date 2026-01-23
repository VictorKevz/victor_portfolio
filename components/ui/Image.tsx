import NextImage, { type ImageProps as NextImageProps } from "next/image";

interface ImageProps extends Omit<NextImageProps, "priority"> {
  priority?: boolean;
  aboveFold?: boolean;
}

export function Image({ priority, aboveFold, loading, ...props }: ImageProps) {
  const isPriority = priority ?? aboveFold ?? false;
  const loadStrategy = isPriority ? undefined : "lazy";

  return (
    <NextImage
      {...props}
      priority={isPriority}
      loading={loadStrategy}
      sizes={
        props.sizes ||
        "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      }
    />
  );
}
