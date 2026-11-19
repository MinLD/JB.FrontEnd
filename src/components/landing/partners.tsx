import Image from "next/image";
import { DesignAsset } from "@/components/ui/design-asset";

const partnerLogos = [
  { name: "Antler", logo: <DesignAsset name="antler" alt="Antler" /> },
  { name: "Do Ventures", logo: <DesignAsset name="doVentures" alt="Do Ventures" /> },
  { name: "VinaCapital", logo: <Image src="/jobbod/partners/vinacapital.png" alt="VinaCapital" width={350} height={62} sizes="160px" /> },
  { name: "Spark Ventures", logo: <DesignAsset name="spark" alt="Spark Ventures" sizes="160px" /> },
  {
    name: "Genesia Ventures",
    logo: (
      <div className="genesia-logo" role="img" aria-label="Genesia Ventures">
        <span className="genesia-symbol"><DesignAsset name="genesiaSymbol" /></span>
        <span className="genesia-vector"><DesignAsset name="genesiaVector" /></span>
        <span className="genesia-text-one"><DesignAsset name="genesiaText1" /></span>
        <span className="genesia-text-two"><DesignAsset name="genesiaText2" /></span>
      </div>
    ),
  },
  { name: "Expara", logo: <DesignAsset name="expara" alt="Expara" sizes="160px" /> },
  { name: "JDI One", logo: <Image src="/jobbod/partners/jdi-one.png" alt="JDI One" width={310} height={309} sizes="54px" /> },
  { name: "Saigon Asset Management", logo: <Image src="/jobbod/partners/saigon-asset-management.png" alt="Saigon Asset Management" width={184} height={156} sizes="64px" /> },
  {
    name: "Golden Gate Ventures",
    logo: (
      <div className="golden-gate">
        <DesignAsset name="goldenGate" alt="" sizes="56px" style={{ width: 56, height: "auto" }} />
        <span>Golden Gate<br />Ventures</span>
      </div>
    ),
  },
  { name: "Crisis Management", logo: <Image src="/jobbod/partners/crisis-management.png" alt="Crisis Management Venture Capital Fund" width={601} height={299} sizes="110px" /> },
  { name: "Aavishkaar Group", logo: <DesignAsset name="aavishkaar" alt="Aavishkaar Group" sizes="160px" /> },
  { name: "Quest Ventures", logo: <DesignAsset name="quest" alt="Quest Ventures" sizes="120px" /> },
];

export function Partners() {
  return <section className="partners-section" aria-labelledby="partners-heading">
    <div className="page-container">
      <div className="section-heading"><h2 id="partners-heading">Nhà tài trợ &amp; đồng hành</h2><p>Cùng tạo thêm cơ hội cho sinh viên.</p></div>
      <div className="partner-marquee">
        <div className="partner-logos">
          <div className="partner-track">
            {[false, true].map(duplicate => (
              <ul key={String(duplicate)} className="partner-logo-list" aria-hidden={duplicate || undefined}>
                {partnerLogos.map(({ name, logo }) => (
                  <li key={name} className="partner-logo">{logo}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <h2 className="matching-heading">Một kết nối tốt, bắt đầu từ ba điều.</h2>
      <div className="matching-grid">
        <div><DesignAsset name="matchGoal" /><h3>Cùng mục tiêu</h3><p>Chung hướng đi cùng tiến.</p></div>
        <div><DesignAsset name="matchSkills" /><h3>Bổ trợ kỹ năng</h3><p>Mỗi người một thế mạnh.</p></div>
        <div><DesignAsset name="matchSchedule" /><h3>Hợp lịch rảnh</h3><p>Có thời gian cho nhau.</p></div>
      </div>
    </div>
  </section>;
}
