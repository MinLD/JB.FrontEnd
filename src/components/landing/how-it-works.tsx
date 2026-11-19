import Image from "next/image";
const steps = [
  {
    title: "Tạo hồ sơ cùng Bob",
    label: "01 / Tạo hồ sơ",
    description: "Chia sẻ mục tiêu, kỹ năng và lịch rảnh. Bob tổng hợp thành hồ sơ để bạn xem lại trước khi tìm đội.",
    illustration: "profile",
  },
  {
    title: "Tìm người bổ trợ kỹ năng",
    label: "02 / Tìm đồng đội",
    description: "Bob gợi ý người cùng mục tiêu, bổ trợ kỹ năng và hợp lịch. Bạn xem lý do phù hợp rồi quyết định gửi lời mời.",
    illustration: "match",
  },
  {
    title: "Cùng làm dự án",
    label: "03 / Hợp tác dự án",
    description: "Sau khi kết nối, cả nhóm thống nhất phần việc, lên lịch trao đổi và cùng theo dõi tiến độ.",
    illustration: "project",
  },
  {
    title: "Ghi lại phần bạn đóng góp",
    label: "04 / Career DNA",
    description: "Lưu vai trò, kỹ năng và sản phẩm bạn đã làm vào hồ sơ năng lực Career DNA.",
    illustration: "career",
  },
];

const connectors = [
  { className: "line-one", viewBox: "0 0 307.216 83.8313", line: "M0.9 73.9847C47.4 73.9847 92.4 43.2347 81.9 17.7347C70.65 -10.7653 36.9 -0.265331 38.4 28.2347C40.65 62.7347 112.65 94.9847 166.65 78.4847C218.4 62.7347 242.4 34.9847 305.4 62.7347", tip: "M301.04 55.8934L305.4 62.7347L297.408 64.1281" },
  { className: "line-two", viewBox: "0 0 23.4542 80.9509", line: "M1.26428 0.9C29.0143 27.15 29.7643 56.4 2.76428 77.4", tip: "M10.8549 76.8045L2.76428 77.4L5.32632 69.7027" },
  { className: "line-three", viewBox: "0 0 294.3 47.382", line: "M293.4 29.4842C225.9 29.4842 202.65 -10.2658 152.4 3.98417C112.65 15.9842 135.15 60.2342 169.65 42.2342C200.4 24.2342 123.9 -4.26583 69.9 17.4842C41.4 27.9842 21.15 28.7342 0.9 28.7342", tip: "M7.65 33.2342L0.9 28.7342L7.65 24.2342" },
];

function Connector({ className, viewBox, line, tip, index }: {
  className: string; viewBox: string; line: string; tip: string; index: number;
}) {
  return (
    <svg className={className} data-workflow-arrow={index} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
      <path d={line} pathLength={1} data-arrow-line />
      <path d={tip} data-arrow-tip vectorEffect="non-scaling-stroke" />
      <circle data-arrow-spark r={3.5} opacity={0} />
    </svg>
  );
}

export function HowItWorks() {
  return <section className="workflow-section" id="cach-hoat-dong" aria-labelledby="workflow-heading">
    <div className="page-container">
      <div className="section-heading workflow-heading">
        <p className="eyebrow">CÁCH HOẠT ĐỘNG</p>
        <h2 id="workflow-heading">Từ ý tưởng đến <em>dự án thật.</em></h2>
        <p>Tìm người phù hợp, cùng làm dự án và ghi lại những gì bạn đã đóng góp.</p>
      </div>
      <div className="workflow">
        <div className="workflow-viewport">
          <div className="workflow-track">
            {connectors.map(({ className, ...path }, index) => (
              <Connector key={className} {...path} className={`step-line ${className}`} index={index} />
            ))}
            <ol className="workflow-grid">
              {steps.map((step, index) => (
                <li className={`workflow-step step-${index + 1}`} key={step.label}>
                  <div className="step-card">
                    <div className="step-copy">
                      <span className="step-label">{step.label}</span>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                    <div className="step-art">
                      <Image
                        src={`/jobbod/workflow/${step.illustration}.webp`}
                        alt=""
                        width={520}
                        height={416}
                        sizes="(max-width: 650px) 115px, 170px"
                      />
                    </div>
                  </div>
                  {index < connectors.length && (
                    <Connector className="step-line-mobile" viewBox="0 0 64 72" line="M23 3C42 9 50 25 39 35C29 44 14 34 21 25C29 14 46 33 40 49C37 57 31 62 24 67" tip="M25 57L24 67L34 65" index={index} />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
