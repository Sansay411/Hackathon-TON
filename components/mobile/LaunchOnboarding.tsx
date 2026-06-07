"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Languages, UserRound, WalletCards } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTelegram } from "@/components/telegram-provider";
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
  const { user, authStatus, isTelegram } = useTelegram();
  const { language, setLanguage, t } = useLanguage();
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [role, setRole] = useState<(typeof roles)[number]["value"]>("both");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "complete") {
      setCompleted(true);
    }
    setReady(true);
  }, []);

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

  const finish = () => {
    window.localStorage.setItem(storageKey, "complete");
    setCompleted(true);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-white bg-white/80 p-4 shadow-[0_10px_30px_rgba(0,101,142,0.07)] backdrop-blur">
        <div className="flex items-center gap-3">
          <TelegramAvatar photoUrl={user?.photoUrl ?? null} name={displayName} />
          <div className="min-w-0">
            <p className="text-sm font-black text-[#00658e]">{t.onboarding.setup}</p>
            <h1 className="truncate text-2xl font-black text-[#171c20]">{displayName}</h1>
            <p className="text-xs font-semibold text-[#64748b]">
              {!isTelegram
                ? t.onboarding.openInTelegram
                : authStatus === "verified"
                  ? t.onboarding.verified
                  : authStatus === "verifying"
                    ? t.onboarding.verifying
                    : authStatus === "error"
                      ? t.onboarding.verifyError
                      : t.onboarding.verifyUnavailable}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#dfe3e8] bg-white p-4 shadow-[0_10px_30px_rgba(0,101,142,0.07)]">
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
          <Link className="block rounded-2xl bg-[#229ED9] px-4 py-3 text-center text-sm font-black text-white" href="/wallet">
            {t.onboarding.openWallet}
          </Link>
        </SetupCard>
      ) : null}

      {currentStep === "profile" ? (
        <SetupCard icon={<UserRound className="h-5 w-5" />} title={t.onboarding.completeProfile} body={t.onboarding.profileBody}>
          <Link className="block rounded-2xl bg-[#e6f7ff] px-4 py-3 text-center text-sm font-black text-[#00658e]" href="/profile">
            {t.onboarding.fillProfile}
          </Link>
        </SetupCard>
      ) : null}

      <div className="grid grid-cols-2 gap-3 pb-8">
        <button
          className="rounded-2xl border border-[#dfe3e8] bg-white px-4 py-3 text-sm font-black text-[#64748b] disabled:opacity-40"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          type="button"
        >
          {t.common.back}
        </button>
        <button
          className="rounded-2xl bg-[#00658e] px-4 py-3 text-sm font-black text-white"
          onClick={() => (stepIndex >= steps.length - 1 ? finish() : setStepIndex((current) => current + 1))}
          type="button"
        >
          {stepIndex >= steps.length - 1 ? t.common.openWorkPay : t.common.continue}
        </button>
      </div>
    </div>
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

function TelegramAvatar({ photoUrl, name }: { photoUrl: string | null; name: string }) {
  if (photoUrl) {
    return <img alt={name} className="h-14 w-14 shrink-0 rounded-full object-cover ring-4 ring-white" src={photoUrl} />;
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#001e2e] text-lg font-black text-white ring-4 ring-white">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}
