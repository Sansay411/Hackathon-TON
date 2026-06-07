"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Languages, Loader2, UserRound, WalletCards } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTelegram } from "@/components/telegram-provider";
import { WorkPayLogo } from "@/components/mobile/WorkPayLogo";
import type { WorkPayLanguage } from "@/lib/domain/types";

const storageKey = "workpay:onboarding:v1";

type Step = "language" | "role" | "wallet" | "profile";

const steps: { id: Step; labelKey: "languageStep" | "roleStep" | "walletStep" | "profileStep" }[] = [
  { id: "language", labelKey: "languageStep" },
  { id: "role", labelKey: "roleStep" },
  { id: "wallet", labelKey: "walletStep" },
  { id: "profile", labelKey: "profileStep" }
];

const languages = [{ code: "en" }, { code: "ru" }] as const satisfies readonly { code: WorkPayLanguage }[];

const roles = [
  { value: "client", labelKey: "client" },
  { value: "freelancer", labelKey: "freelancer" },
  { value: "both", labelKey: "both" }
] as const;

export function LaunchOnboarding({ children }: { children: React.ReactNode }) {
  const { user, authStatus, isTelegram, initData } = useTelegram();
  const { language, setLanguage, t } = useLanguage();
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [role, setRole] = useState<(typeof roles)[number]["value"]>("both");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(user?.telegramId ? `${storageKey}:${user.telegramId}` : storageKey);
    if (saved === "complete") {
      setCompleted(true);
    }
    setReady(true);
  }, [user?.telegramId]);

  useEffect(() => {
    if (user?.languageCode) {
      setLanguage(user.languageCode.startsWith("ru") ? "ru" : "en");
    }
  }, [setLanguage, user?.languageCode]);

  const currentStep = steps[stepIndex]?.id ?? "profile";
  const displayName = useMemo(() => {
    if (!user) {
      return t.onboarding.telegramFallback;
    }
    return [user.firstName, user.lastName].filter(Boolean).join(" ");
  }, [t.onboarding.telegramFallback, user]);

  if (!ready) {
    return null;
  }

  if (completed) {
    return <>{children}</>;
  }

  const finish = async () => {
    setSaving(true);
    if (initData && authStatus === "verified") {
      try {
        await fetch("/api/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData, language, role })
        });
      } catch {
        // Local completion still prevents a broken first-run loop if persistence is temporarily unavailable.
      }
    }
    window.localStorage.setItem(user?.telegramId ? `${storageKey}:${user.telegramId}` : storageKey, "complete");
    setCompleted(true);
    setSaving(false);
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f6faff] text-[#171c20]">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="pointer-events-none absolute -right-20 top-10 h-48 w-48 animate-pulse rounded-full bg-[#80d8ff]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 animate-pulse rounded-full bg-[#229ED9]/20 blur-3xl" />

        <section className="relative rounded-[30px] border border-white bg-white/85 p-4 shadow-[0_14px_40px_rgba(0,101,142,0.1)] backdrop-blur">
          <div className="flex items-center gap-3">
            <WorkPayLogo size="lg" className="animate-pulse" />
          <div className="min-w-0">
            <p className="text-sm font-black text-[#00658e]">{t.onboarding.setup}</p>
            <h1 className="truncate text-2xl font-black text-[#171c20]">{displayName}</h1>
            <p className="text-xs font-semibold text-[#64748b]">
              {isTelegram ? (authStatus === "verified" ? t.onboarding.verified : t.onboarding.verifying) : t.onboarding.openInTelegram}
            </p>
          </div>
          </div>
        </section>

        <section className="relative mt-5 rounded-3xl border border-[#dfe3e8] bg-white p-4 shadow-[0_10px_30px_rgba(0,101,142,0.07)]">
          <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div className="text-center" key={step.id}>
              <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${index <= stepIndex ? "bg-[#229ED9] text-white" : "bg-[#e6f7ff] text-[#00658e]"}`}>
                {index < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </div>
              <p className="mt-1 truncate text-[10px] font-bold text-[#64748b]">{t.onboarding[step.labelKey]}</p>
            </div>
          ))}
          </div>
        </section>

        <div className="relative mt-5 flex-1">
          {currentStep === "language" ? (
            <SetupCard icon={<Languages className="h-5 w-5" />} title={t.onboarding.chooseLanguage} body={t.onboarding.languageBody}>
          <div className="grid gap-3">
            {languages.map((item) => (
              <button
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black ${language === item.code ? "border-[#229ED9] bg-[#229ED9] text-white" : "border-[#dfe3e8] bg-[#f6faff] text-[#171c20]"}`}
                key={item.code}
                onClick={() => setLanguage(item.code)}
                type="button"
              >
                {t.onboarding.languages[item.code]}
              </button>
            ))}
          </div>
            </SetupCard>
          ) : null}

          {currentStep === "role" ? (
            <SetupCard icon={<UserRound className="h-5 w-5" />} title={t.onboarding.chooseRole} body={t.onboarding.roleBody}>
          <div className="grid gap-3">
            {roles.map((item) => (
              <button
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black ${role === item.value ? "border-[#00658e] bg-[#00658e] text-white" : "border-[#dfe3e8] bg-[#f6faff] text-[#171c20]"}`}
                key={item.value}
                onClick={() => setRole(item.value)}
                type="button"
              >
                {t.onboarding.roles[item.labelKey]}
              </button>
            ))}
          </div>
            </SetupCard>
          ) : null}

          {currentStep === "wallet" ? (
            <SetupCard icon={<WalletCards className="h-5 w-5" />} title={t.onboarding.connectWallet} body={t.onboarding.walletBody}>
              <p className="rounded-2xl bg-[#e6f7ff] px-4 py-3 text-center text-sm font-black text-[#00658e]">{t.onboarding.openWallet}</p>
            </SetupCard>
          ) : null}

          {currentStep === "profile" ? (
            <SetupCard icon={<UserRound className="h-5 w-5" />} title={t.onboarding.completeProfile} body={t.onboarding.profileBody}>
              <p className="rounded-2xl bg-[#e6f7ff] px-4 py-3 text-center text-sm font-black text-[#00658e]">{t.onboarding.fillProfile}</p>
            </SetupCard>
          ) : null}
        </div>

        <div className="relative grid grid-cols-2 gap-3 pt-5">
        <button
          className="rounded-2xl border border-[#dfe3e8] bg-white px-4 py-3 text-sm font-black text-[#64748b] disabled:opacity-40"
          disabled={stepIndex === 0 || saving}
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          type="button"
        >
          {t.common.back}
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00658e] px-4 py-3 text-sm font-black text-white disabled:opacity-70"
          disabled={saving}
          onClick={() => (stepIndex >= steps.length - 1 ? void finish() : setStepIndex((current) => current + 1))}
          type="button"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {stepIndex >= steps.length - 1 ? t.common.openWorkPay : t.common.continue}
        </button>
        </div>
      </div>
    </main>
  );
}

function SetupCard({ icon, title, body, children }: { icon: React.ReactNode; title: string; body: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#dfe3e8] bg-white p-5 shadow-[0_10px_30px_rgba(0,101,142,0.07)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f7ff] text-[#00658e]">{icon}</div>
      <h2 className="mt-4 text-2xl font-black text-[#171c20]">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#64748b]">{body}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
