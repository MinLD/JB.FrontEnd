"use client";
import { motion, useReducedMotion } from "motion/react";
import { DesignAsset } from "@/components/ui/design-asset";
import { ScaledScene } from "./scaled-scene";
import { StartLink } from "./start-link";
import { useI18n } from "@/providers/i18n-provider";

export function PhotoScene() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const transition = { duration: 8, times: [0, 0.5, 1], ease: "easeInOut" as const, repeat: Infinity };
  return <ScaledScene width={627} height={416} className="photo-scene">
    <div className="photo-stage">
      <motion.div className="photo-main" data-node-id="131:1824" style={{ transformOrigin: "0 0" }}
        transformTemplate={({ z = "0px", rotateY = "0deg", rotateZ = "0deg" }) => `translate(50%, 50%) translateZ(${z}) rotateY(${rotateY}) rotateZ(${rotateZ}) translate(-50%, -50%)`}
        initial={{ rotateY: 2, rotateZ: 3, z: "26.226px" }} animate={reduced ? { rotateY: 2 } : { rotateY: [2, -3, 2] }} transition={{ rotateY: transition }}>
        <div className="photo-crop"><DesignAsset name="photoMain" alt={t("accessibility.photo_main")} sizes="(max-width: 700px) 70vw, 429px" /></div>
      </motion.div>
      <motion.div className="photo-student" data-node-id="131:1826" style={{ transformOrigin: "0 0" }}
        transformTemplate={({ z = "0px", rotateY = "0deg", rotateZ = "0deg" }) => `translate(50%, 50%) translateZ(${z}) rotateY(${rotateY}) rotateZ(${rotateZ}) translate(-50%, -50%)`}
        initial={{ rotateY: -4, rotateZ: -7, z: "18.75px" }} animate={reduced ? { rotateY: -4, rotateZ: -7 } : { rotateY: [-4, 5, -4], rotateZ: [-7, -4, -7] }} transition={{ rotateY: transition, rotateZ: transition }}>
        <div className="photo-crop"><DesignAsset name="photoStudent" alt={t("accessibility.photo_student")} sizes="350px" /></div>
      </motion.div>
      <motion.div className="photo-team-outer" data-node-id="131:1827" style={{ transformOrigin: "0 0" }}
        transformTemplate={({ z = "0px", rotateY = "0deg", rotateZ = "0deg" }) => `translate(50%, 50%) translateZ(${z}) rotateY(${rotateY}) rotateZ(${rotateZ}) translate(-50%, -50%)`}
        initial={{ rotateY: 3, rotateZ: -6, z: "30px" }} animate={reduced ? { rotateZ: -6 } : { rotateZ: [-6, -3, -6] }} transition={{ rotateZ: transition }}>
        <div className="photo-team"><div className="photo-crop"><DesignAsset name="photoTeam" alt={t("accessibility.photo_team")} sizes="220px" /></div></div>
      </motion.div>
    </div>
  </ScaledScene>;
}

export function BobSection() {
  const { t } = useI18n();

  return <section className="bob-section" id="lam-quen-voi-bob" aria-labelledby="bob-heading">
    <div className="bob-background" aria-hidden="true"><DesignAsset name="bobBackground" /></div>
    <div className="bob-container">
      <ScaledScene width={640} height={560} className="bob-scene">
        <div className="bob-orbit" aria-hidden="true"><DesignAsset name="bobOrbit" /></div>
        <div className="bob-shadow"><DesignAsset name="bobShadow" /></div>
        <div className="bob-character" data-node-id="131:2277">
          <DesignAsset name="bob" alt="Bob" sizes="279px" />
        </div>
        <div className="bob-greeting" data-node-id="131:2278">
          <span>{t("bob.assistant_badge")}</span><p>{t("bob.greeting_line1")}<br />{t("bob.greeting_line2")}</p>
        </div>
      </ScaledScene>
      <div className="bob-copy" data-node-id="131:2281">
        <p className="eyebrow gold">{t("bob.eyebrow")}</p>
        <h2 id="bob-heading">{t("bob.heading_line1_pre")}<em>{t("bob.heading_line1_em")}</em><br />{t("bob.heading_line2")}</h2>
        <p>{t("bob.description")}</p>
        <ul className="bob-benefits">
          <li><strong>{t("bob.benefit1_title")}</strong><span>{t("bob.benefit1_desc")}</span></li>
          <li><strong>{t("bob.benefit2_title")}</strong><span>{t("bob.benefit2_desc")}</span></li>
          <li><strong>{t("bob.benefit3_title")}</strong><span>{t("bob.benefit3_desc")}</span></li>
        </ul>
        <StartLink className="bob-cta">{t("bob.cta")} <DesignAsset name="bobArrow" /></StartLink>
      </div>
    </div>
  </section>;
}
