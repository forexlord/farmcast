import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import Image from "next/image";

type OverlayMarker = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  pulse?: boolean;
};

type ComparisonImageProps = {
  src: string;
  alt: string;
  label: string;
  variant: "original" | "ai";
  overlayMarkers?: readonly OverlayMarker[];
};

export function ComparisonImage({
  src,
  alt,
  label,
  variant,
  overlayMarkers,
}: ComparisonImageProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden border group h-full min-h-[300px]",
        variant === "ai" ? "border-primary/50" : "border-outline-variant",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover",
          variant === "ai" && "brightness-75 contrast-125",
        )}
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized
      />

      {overlayMarkers && (
        <div className="absolute inset-0 pointer-events-none">
          {overlayMarkers.map((marker, index) => (
            <div
              key={index}
              className={cn(
                "absolute w-8 h-8 rounded-full border-2 border-primary",
                marker.pulse && "animate-pulse",
              )}
              style={{
                top: marker.top,
                left: marker.left,
                right: marker.right,
                bottom: marker.bottom,
              }}
            />
          ))}
        </div>
      )}

      {variant === "original" ? (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-label-md text-white">
          {label}
        </div>
      ) : (
        <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded text-label-md flex items-center gap-1">
          <Icon name="auto_awesome" size="sm" />
          {label}
        </div>
      )}
    </div>
  );
}
