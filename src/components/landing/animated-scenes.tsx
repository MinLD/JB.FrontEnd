"use client";
import { motion, useReducedMotion } from "motion/react";
import { DesignAsset } from "@/components/ui/design-asset";
import { ScaledScene } from "./scaled-scene";
import { StartLink } from "./start-link";

export function PhotoScene() {
  const reduced = useReducedMotion();
  const transition = { duration: 8, times: [0, 0.5, 1], ease: "easeInOut" as const, repeat: Infinity };
  return <ScaledScene width={627} height={416} className="photo-scene">
    <div className="photo-stage">
      <motion.div className="photo-main" data-node-id="131:1824" style={{ transformOrigin: "0 0" }}
        transformTemplate={({ z = "0px", rotateY = "0deg", rotateZ = "0deg" }) => `translate(50%, 50%) translateZ(${z}) rotateY(${rotateY}) rotateZ(${rotateZ}) translate(-50%, -50%)`}
        initial={{ rotateY: 2, rotateZ: 3, z: "26.226px" }} animate={reduced ? { rotateY: 2 } : { rotateY: [2, -3, 2] }} transition={{ rotateY: transition }}>
        <div className="photo-crop"><DesignAsset name="photoMain" alt="Sinh viên NTTU cùng trình bày dự án" sizes="(max-width: 700px) 70vw, 429px" /></div>
      </motion.div>
      <motion.div className="photo-student" data-node-id="131:1826" style={{ transformOrigin: "0 0" }}
        transformTemplate={({ z = "0px", rotateY = "0deg", rotateZ = "0deg" }) => `translate(50%, 50%) translateZ(${z}) rotateY(${rotateY}) rotateZ(${rotateZ}) translate(-50%, -50%)`}
        initial={{ rotateY: -4, rotateZ: -7, z: "18.75px" }} animate={reduced ? { rotateY: -4, rotateZ: -7 } : { rotateY: [-4, 5, -4], rotateZ: [-7, -4, -7] }} transition={{ rotateY: transition, rotateZ: transition }}>
        <div className="photo-crop"><DesignAsset name="photoStudent" alt="Sinh viên giới thiệu sản phẩm tại cuộc thi" sizes="350px" /></div>
      </motion.div>
      <motion.div className="photo-team-outer" data-node-id="131:1827" style={{ transformOrigin: "0 0" }}
        transformTemplate={({ z = "0px", rotateY = "0deg", rotateZ = "0deg" }) => `translate(50%, 50%) translateZ(${z}) rotateY(${rotateY}) rotateZ(${rotateZ}) translate(-50%, -50%)`}
        initial={{ rotateY: 3, rotateZ: -6, z: "30px" }} animate={reduced ? { rotateZ: -6 } : { rotateZ: [-6, -3, -6] }} transition={{ rotateZ: transition }}>
        <div className="photo-team"><div className="photo-crop"><DesignAsset name="photoTeam" alt="Đội thi sinh viên trưng bày sản phẩm" sizes="220px" /></div></div>
      </motion.div>
    </div>
  </ScaledScene>;
}

export function BobSection() {
  return <section className="bob-section" id="lam-quen-voi-bob" aria-labelledby="bob-heading">
    <div className="bob-background" aria-hidden="true"><DesignAsset name="bobBackground" /></div>
    <div className="bob-container">
      <ScaledScene width={640} height={560} className="bob-scene">
        <div className="bob-orbit" aria-hidden="true"><DesignAsset name="bobOrbit" /></div>
        <div className="bob-shadow"><DesignAsset name="bobShadow" /></div>
        <div className="bob-character" data-node-id="131:2277">
          <DesignAsset name="bob" alt="Bob, trợ lý AI tìm đồng đội của Jobbod" sizes="279px" />
        </div>
        <div className="bob-greeting" data-node-id="131:2278">
          <span>Bob · Trợ lý AI</span><p>Chào bạn! Bạn đang tìm nhóm<br />cho dự án nào?</p>
        </div>
      </ScaledScene>
      <div className="bob-copy" data-node-id="131:2281">
        <p className="eyebrow gold">LÀM QUEN VỚI BOB</p>
        <h2 id="bob-heading">Đây là <em>Bob</em>.<br />Trợ lý AI tìm đồng đội.</h2>
        <p>Chia sẻ kỹ năng, mục tiêu và thời gian của bạn. Bob giúp bạn tạo hồ sơ và gợi ý đồng đội phù hợp để cùng làm dự án.</p>
        <ul className="bob-benefits">
          <li><strong>Tạo hồ sơ cùng Bob</strong><span>Từ kỹ năng, mục tiêu và thời gian của bạn.</span></li>
          <li><strong>Tìm đúng đồng đội</strong><span>Gợi ý người phù hợp, giải thích rõ lý do.</span></li>
          <li><strong>Cùng bắt đầu dự án</strong><span>Kết nối, lập nhóm và làm việc cùng nhau.</span></li>
        </ul>
        <StartLink className="bob-cta">Trò chuyện với Bob <DesignAsset name="bobArrow" /></StartLink>
      </div>
    </div>
  </section>;
}
