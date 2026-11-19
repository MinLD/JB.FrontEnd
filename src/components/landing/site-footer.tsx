import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Copyright } from "@/components/layout/copyright";
import { DesignAsset } from "@/components/ui/design-asset";
import { designAssets } from "@/config/design-assets";
import { ScaledScene } from "./scaled-scene";
import { StartLink } from "./start-link";
import { MissionDialog } from "./mission-dialog";

const wordmarkLetters = [
  ["letter-j", "footerJ"],
  ["letter-o-one", "footerO"],
  ["letter-b-one", "footerB"],
  ["letter-b-two", "footerB"],
  ["letter-o-two", "footerO"],
  ["letter-d", "footerD"],
] as const;

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return <footer className={`site-footer${compact ? " footer-compact" : ""}`}>
    <div className="footer-main page-container">
      {!compact && <><div className="footer-invitation"><div><p className="eyebrow">CÙNG BẮT ĐẦU</p><h2>Một lời chào.<br /><em>Một đội hình mới.</em></h2></div><div><p>Tìm người cùng mục tiêu, bổ trợ kỹ năng<br />và sẵn sàng bắt đầu cùng bạn.</p><StartLink>Tìm đồng đội <ArrowUpRight size={16} aria-hidden="true" /></StartLink></div></div>
      <div className="footer-divider" />
      <div className="footer-wordmark" role="img" aria-label="Jobbod">
        <ScaledScene width={827} height={197}>
          {wordmarkLetters.map(([position, asset]) => (
            <span className={`wordmark-letter ${position}`} key={position}>
              <span className="wordmark-glyph"><DesignAsset name={asset} style={{ width: designAssets[asset].width, height: designAssets[asset].height }} /></span>
            </span>
          ))}
        </ScaledScene>
      </div>
      </>}
      <nav className="footer-links" aria-label="Thông tin JobBod"><Link href="/about">Về chúng tôi</Link><MissionDialog /><Link href="/terms">Điều khoản</Link><Link href="/privacy">Quyền riêng tư</Link><Link href="/cookies">Chính sách Cookie</Link></nav>
      <div className="footer-bottom"><span><Copyright /></span><span>Dành cho sinh viên. Cùng xây dựng dự án thật.</span></div>
    </div>
  </footer>;
}
