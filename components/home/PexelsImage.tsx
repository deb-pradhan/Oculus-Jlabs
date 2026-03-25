import Image from "next/image";
import styles from "./PexelsImage.module.css";

interface PexelsImageProps {
  src: string;
  alt: string;
  photographer: string;
  className?: string;
  priority?: boolean;
}

export default function PexelsImage({
  src,
  alt,
  photographer,
  className,
  priority,
}: PexelsImageProps) {
  return (
    <div className={styles.imageContainer + (className ? ` ${className}` : '')}>
      <Image src={src} alt={alt} fill className={styles.image} sizes="(max-width: 768px) 100vw, 60vw" priority={priority} />
      <div className={styles.overlay} />
      <div className={styles.tint} />
      <div className={styles.grain} />
      <span className={styles.attribution}>
        Photo by {photographer} · Pexels
      </span>
    </div>
  );
}
