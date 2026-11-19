import Image from "next/image";
import { DesignAsset } from "@/components/ui/design-asset";

const organizations = [
  { name: "NTTU", description: "Đại học Nguyễn Tất Thành", src: "/jobbod/partners/nttu.svg", width: 376, height: 90 },
  { name: "NJEC", description: "CLB Nhà khởi nghiệp trẻ", src: "/jobbod/partners/njec.png", width: 1182, height: 886 },
  { name: "NIIC", description: "Trung tâm Sáng tạo & Ươm tạo khởi nghiệp", src: "/jobbod/partners/niic.png", width: 2048, height: 991 },
];

export function Partners() {
  return <section className="partners-section" aria-labelledby="partners-heading">
    <div className="page-container">
      <div className="section-heading"><p className="eyebrow">CÙNG CỘNG ĐỒNG SINH VIÊN</p><h2 id="partners-heading">Học tập. Kết nối. Cùng phát triển.</h2><p>Trong hệ sinh thái đại học và khởi nghiệp.</p></div>
      <ul className="partner-organizations" aria-label="Các trường và cộng đồng">
        {organizations.map(organization => <li key={organization.name}>
          <div className={`organization-logo organization-${organization.name.toLowerCase()}`}><Image src={organization.src} alt={organization.name} width={organization.width} height={organization.height} sizes="(max-width: 650px) 28vw, 250px" /></div>
          <p>{organization.description}</p>
        </li>)}
      </ul>
      <h2 className="matching-heading">Một kết nối tốt, bắt đầu từ ba điều.</h2>
      <div className="matching-grid">
        <div><DesignAsset name="matchGoal" /><h3>Cùng mục tiêu</h3><p>Chung hướng đi cùng tiến.</p></div>
        <div><DesignAsset name="matchSkills" /><h3>Bổ trợ kỹ năng</h3><p>Mỗi người một thế mạnh.</p></div>
        <div><DesignAsset name="matchSchedule" /><h3>Hợp lịch rảnh</h3><p>Có thời gian cho nhau.</p></div>
      </div>
    </div>
  </section>;
}
