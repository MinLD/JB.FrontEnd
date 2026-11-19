"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IdCard,
  LoaderCircle,
  UserRound,
  UsersRound,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Stepper, type StepItem } from "@/components/ui/stepper";
import { FeatureItem } from "@/components/ui/feature-item";
import { AppHeader } from "@/components/layout/app-header";
import { useAuth } from "@/providers/auth-provider";
import { logout } from "@/services/auth-service";
import { BobMascotStage } from "./bob-mascot-stage";

const ONBOARDING_STEPS: StepItem[] = [
  { id: "01", label: "Làm quen", number: "01" },
  { id: "02", label: "Tạo hồ sơ", number: "02" },
  { id: "03", label: "Xác nhận", number: "03" },
  { id: "04", label: "Quyền của Bob", number: "04" },
];

export function UserScreen() {
  const { user, loading, error, reload } = useAuth();
  const router = useRouter();
  const reduced = useReducedMotion();

  const [currentStep, setCurrentStep] = useState("01");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user && !error) {
      router.replace("/login");
    }
  }, [user, loading, error, router]);

  async function handleLogout() {
    setLoggingOut(true);
    const result = await logout();
    if (result.success) {
      toast.success("Đã đăng xuất thành công.", { id: "auth-logout" });
      router.replace("/login");
    } else {
      toast.error(result.message, { id: "auth-logout" });
      setLoggingOut(false);
    }
  }

  function handleStartOnboarding() {
    toast.success("Bắt đầu hành trình cùng Bob!", {
      description: "Chào mừng bạn đến với Jobbod.",
      id: "bob-onboarding",
    });
    setCurrentStep("02");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <main
          className="flex min-h-[calc(100vh-64px)] items-center justify-center"
          role="status"
        >
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <LoaderCircle className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Đang xác thực tài khoản…</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <p role="alert" className="text-sm text-destructive">{error}</p>
            <Button onClick={() => void reload()}>Thử lại</Button>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center text-sm text-muted-foreground">
          Đang chuyển đến đăng nhập…
        </main>
      </div>
    );
  }

  // Animation variants for staggered entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      {/* Top App Header with Stepper & Logout */}
      <AppHeader
        center={
          <Stepper
            steps={ONBOARDING_STEPS}
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(String(step.id))}
          />
        }
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      {/* Main Screen Container with Isolated Stacking Context */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden py-6 sm:py-8 lg:py-12 isolate">
        {/* Background Waves & Yellow Accent Dots (Clean White BG with Bottom Wave Lines) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[140px] sm:h-[180px] lg:h-[220px] w-full select-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="absolute bottom-0 left-0 size-full w-full"
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Bottom Flowing Wave Line 1 */}
            <path
              d="M60 152 C186 121, 294 171, 426 181.5 C542 191.5, 627 156.7, 729 169.1 C827 181.5, 885 215.6, 1032 207.6 C1194 198.9, 1320 143.1, 1440 165.4"
              stroke="#D9DCD5"
              strokeWidth="1.2"
            />
            {/* Bottom Flowing Wave Line 2 */}
            <path
              d="M32 169.8 C158 138.8, 288 189.6, 420 200.1 C536 210.1, 633 175.9, 735 187.7 C810 196, 920 215, 1032 207.6"
              stroke="#ECEEE8"
              strokeWidth="1.2"
            />
            {/* Yellow Coordinate Accent Dots from Figma */}
            <circle
              cx="426"
              cy="181.5"
              r="4.5"
              fill="#F2C744"
            />
            <circle
              cx="1032"
              cy="207.6"
              r="4.5"
              fill="#F2C744"
            />
          </svg>
        </div>

        {/* Content 2-Column Grid (Z-INDEX: 10, ABOVE BACKGROUND) */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1340px] grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14 px-4 sm:px-8 lg:px-12">
          {/* Left Column: Bob Mascot Stage */}
          <div className="flex items-center justify-center lg:col-span-6 order-1 lg:order-1">
            <BobMascotStage />
          </div>

          {/* Right Column: Intro Copy & Features */}
          <motion.div
            className="flex flex-col justify-center w-full max-w-[500px] mx-auto lg:mx-0 lg:col-span-6 order-2 lg:order-2"
            variants={containerVariants}
            initial={reduced ? false : "hidden"}
            animate={reduced ? false : "visible"}
          >
            {/* Eyebrow Label */}
            <motion.p
              variants={itemVariants}
              className="m-0 mb-2.5 sm:mb-3.5 text-[11px] sm:text-[12px] font-bold tracking-[0.16em] text-[#6a7580] uppercase"
            >
              LÀM QUEN VỚI BOB
            </motion.p>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="m-0 mb-2.5 sm:mb-3 text-[30px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-[#1f2937] leading-[1.15]"
            >
              Xin chào!<br />
              Mình là Bob.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="m-0 mb-5 sm:mb-6 text-[14px] sm:text-[15px] leading-relaxed text-[#526172] max-w-[460px]"
            >
              Trợ lý AI giúp bạn tạo hồ sơ, tìm đồng đội phù hợp và bắt đầu dự án cùng nhóm.
            </motion.p>

            {/* Feature List */}
            <motion.div
              variants={itemVariants}
              className="mb-6 sm:mb-7 flex flex-col border-y border-[#e5e8eb] divide-y divide-[#e5e8eb]"
            >
              <FeatureItem
                icon={<UserRound size={20} className="stroke-[1.8]" />}
                title="Hiểu mục tiêu của bạn"
                description="Tổng hợp hồ sơ từ những gì bạn chia sẻ."
              />
              <FeatureItem
                icon={<UsersRound size={20} className="stroke-[1.8]" />}
                title="Tìm đồng đội phù hợp"
                description="Đối chiếu mục tiêu, kỹ năng và lịch rảnh."
              />
              <FeatureItem
                icon={<IdCard size={20} className="stroke-[1.8]" />}
                title="Đồng hành cùng dự án"
                description="Hỗ trợ kết nối và ghi nhận kết quả cộng tác."
              />
            </motion.div>

            {/* Action Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleStartOnboarding}
                className="h-[46px] w-full sm:w-auto sm:min-w-[210px] px-8 rounded-[10px] bg-[#f2c744] hover:bg-[#dfaa28] text-[#20211e] font-semibold text-[15px] shadow-xs cursor-pointer transition-all"
              >
                Bắt đầu cùng Bob
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
