"use client";

import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";
import { DesignAsset } from "@/components/ui/design-asset";
import { ScaledScene } from "@/components/landing/scaled-scene";

export function BobMascotStage() {
  const { t } = useI18n();
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[540px] select-none">
      <ScaledScene width={640} height={560} className="w-full relative">
        {/* Orbit Background with Entrance Animation */}
        <motion.div
          className="bob-orbit absolute inset-0 pointer-events-none"
          initial={reduced ? false : { scale: 0.9, opacity: 0 }}
          animate={reduced ? false : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <DesignAsset name="bobOrbit" priority className="w-full h-full" />
        </motion.div>

        {/* Bob Ground Shadow with Breathing Sync */}
        <motion.div
          className="bob-shadow absolute left-[265px] top-[509px] w-[256px]"
          animate={
            reduced
              ? false
              : {
                  scaleX: [1, 0.92, 1],
                  scaleY: [1, 0.88, 1],
                  opacity: [0.85, 0.6, 0.85],
                }
          }
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DesignAsset name="bobShadow" />
        </motion.div>

        {/* Bob Mascot Character with Idle Floating Animation */}
        <motion.div
          className="bob-character absolute left-[253px] top-[141px] w-[279px] h-[363px]"
          initial={reduced ? false : { y: 25, opacity: 0 }}
          animate={
            reduced
              ? false
              : {
                  y: [0, -10, 0],
                  opacity: 1,
                }
          }
          transition={
            reduced
              ? undefined
              : {
                  y: {
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 0.7, delay: 0.15 },
                }
          }
        >
          <DesignAsset
            name="bob"
            alt={t("onboarding.bob_alt")}
            priority
            sizes="(max-width: 640px) 240px, 279px"
          />
        </motion.div>
      </ScaledScene>
    </div>
  );
}
