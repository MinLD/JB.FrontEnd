import Image from "next/image";
import { Copyright } from "@/components/layout/copyright";
import { DesignAsset } from "@/components/ui/design-asset";
import { TEAM_GROUPS } from "@/config/landing";
import { designAssets } from "@/config/design-assets";
import { ScaledScene } from "./scaled-scene";
import { StartLink } from "./start-link";

const wordmarkLetters = [
  ["letter-j", "footerJ"],
  ["letter-o-one", "footerO"],
  ["letter-b-one", "footerB"],
  ["letter-b-two", "footerB"],
  ["letter-o-two", "footerO"],
  ["letter-d", "footerD"],
] as const;

export function SiteFooter() {
  return <footer className="site-footer">
    <section id="doi-ngu" className="founders-section page-container" aria-labelledby="founders-heading" data-node-id="227:3654">
      <p className="eyebrow gold">ĐỘI NGŨ JOBBOD</p>
      <h2 id="founders-heading">Những người xây dựng Jobbod</h2>
      <p>Cố vấn, nhà sáng lập và đội ngũ phát triển cùng xây dựng nền tảng kết nối sinh viên.</p>
      <div className="team-groups">
        {TEAM_GROUPS.map(group => (
          <section key={group.id} className="team-group" aria-labelledby={`team-${group.id}`}>
            <div className="team-group-heading">
              <h3 id={`team-${group.id}`}><span aria-hidden="true">{group.number} / </span>{group.title}</h3>
              <p>{group.description}</p>
            </div>
            <div className={`founder-grid${group.id === "advisors" ? " founder-grid-advisors" : ""}`}>
              {group.members.map(member => (
                <article key={member.id} className="founder-card">
                  <Image className="founder-portrait" src={member.portrait} alt={`Chân dung ${member.name}`} width={174} height={174} sizes="174px" />
                  <div className="founder-details">
                    <h4>{member.name}</h4>
                    <p className="founder-role">{member.role}</p>
                    <p className="founder-bio">{member.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
    <div className="footer-main page-container">
      <div className="footer-invitation"><div><p className="eyebrow">CÙNG BẮT ĐẦU</p><h2>Một lời chào.<br /><em>Một đội hình mới.</em></h2></div><div><p>Tìm người cùng mục tiêu, bổ trợ kỹ năng<br />và sẵn sàng bắt đầu cùng bạn.</p><StartLink>Tìm đồng đội <span aria-hidden="true">↗</span></StartLink></div></div>
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
      <div className="footer-bottom"><span><Copyright /></span><span>Dành cho sinh viên. Cùng xây dựng dự án thật.</span></div>
    </div>
  </footer>;
}
