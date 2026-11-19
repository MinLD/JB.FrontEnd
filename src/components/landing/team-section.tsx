import Image from "next/image";
import { TEAM_GROUPS } from "@/config/landing";

export function TeamSection() {
  return <section id="doi-ngu" className="founders-section page-container" aria-labelledby="founders-heading">
    <p className="eyebrow gold">ĐỘI NGŨ JOBBOD</p>
    <h2 id="founders-heading">Những người xây dựng JobBod</h2>
    <p>Cố vấn, nhà sáng lập và đội ngũ phát triển cùng xây dựng nền tảng kết nối sinh viên.</p>
    <div className="team-groups">
      {TEAM_GROUPS.map(group => <section key={group.id} className="team-group" aria-labelledby={`team-${group.id}`}>
        <div className="team-group-heading"><h3 id={`team-${group.id}`}><span aria-hidden="true">{group.number} / </span>{group.title}</h3><p>{group.description}</p></div>
        <div className={`founder-grid${group.id === "advisors" ? " founder-grid-advisors" : ""}`}>
          {group.members.map(member => <article key={member.id} className="founder-card">
            <Image className="founder-portrait" src={member.portrait} alt={`Chân dung ${member.name}`} width={174} height={174} sizes="(max-width: 650px) 64px, 174px" />
            <div className="founder-details"><h4>{member.name}</h4><p className="founder-role">{member.role}</p><p className="founder-bio">{member.description}</p></div>
          </article>)}
        </div>
      </section>)}
    </div>
  </section>;
}
