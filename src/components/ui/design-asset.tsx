import Image from "next/image";
import { designAssets, type DesignAssetName } from "@/config/design-assets";
import type { CSSProperties } from "react";

export type DesignAssetProps = {
  name: DesignAssetName; alt?: string; className?: string; priority?: boolean; sizes?: string; style?: CSSProperties; quality?: number; unoptimized?: boolean;
};

/**
 * Hiển thị ảnh/SVG local từ registry designAssets bằng Next Image.
 * @remarks name là key trong config/design-assets.ts. alt rỗng cho ảnh trang trí; priority mặc định false. Khai báo sizes khi ảnh co giãn; className/style điều chỉnh kích thước.
 * @example
 * import { DesignAsset } from "@/components/ui/design-asset";
 * <DesignAsset name="authWordmark" alt="Jobbod" priority />
 */
export function DesignAsset({ name, alt = "", className, priority = false, sizes, style, quality, unoptimized }: DesignAssetProps) {
  const asset = designAssets[name];
  return (
    <Image
      {...asset}
      width={Math.round(asset.width)}
      height={Math.round(asset.height)}
      alt={alt}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={quality}
      unoptimized={unoptimized}
      style={style}
    />
  );
}
