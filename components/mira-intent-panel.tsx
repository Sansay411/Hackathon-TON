"use client";

import { useMemo, useState } from "react";
import { Bot, Copy, ExternalLink, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useTelegram } from "@/components/telegram-provider";
import { AiRiskBadge } from "@/components/mobile/AiRiskBadge";
import {
  createFullMiraPrompt,
  createMiraDeepLink,
  parseMiraReview,
  type MiraIntentInput,
  type ParsedMiraReview
} from "@/lib/mira/intent";

type Phase = "idle" | "generated" | "reviewed";

export function MiraIntentPanel({ input }: { input: MiraIntentInput }) {
  const { t } = useLanguage();
  const { isTelegram } = useTelegram();
  const [phase, setPhase] = useState<Phase>("idle");
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState("");
  const [parsed, setParsed] = useState<ParsedMiraReview | null>(null);

  const deepLink = useMemo(() => createMiraDeepLink(input), [input]);
  const fullPrompt = useMemo(() => createFullMiraPrompt(input), [input]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const openMira = () => {
    const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
    if (isTelegram && tg?.openTelegramLink) {
      tg.openTelegramLink(deepLink);
      return;
    }
    window.open(deepLink, "_blank", "noopener,noreferrer");
  };

  const showReview = () => {
    setParsed(parseMiraReview(pasted));
    setPhase("reviewed");
  };

  return (
    <section className="rounded-[30px] border border-[#dfe3e8] bg-white p-5 shadow-[0_14px_34px_rgba(0,101,142,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#229ED9]">{t.mira.title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#64748b]">{t.mira.subtitle}</p>
        </div>
        <div className="rounded-2xl bg-[#171c20] p-3 text-[#e6f7ff]">
          <Bot className="h-6 w-6" />
        </div>
      </div>

      {phase === "idle" ? (
        <div className="mt-4">
          <p className="text-sm font-semibold leading-6 text-[#64748b]">{t.mira.idleHint}</p>
          <button
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#229ED9] px-4 py-3 text-sm font-black text-white"
            onClick={() => setPhase("generated")}
            type="button"
          >
            <Sparkles className="h-4 w-4" />
            {t.mira.generatePrompt}
          </button>
        </div>
      ) : null}

      {phase !== "idle" ? (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{t.mira.deepLinkLabel}</p>
            <p className="mt-1 break-all rounded-2xl bg-[#f6faff] px-3 py-2 text-xs font-semibold text-[#00658e]">{deepLink}</p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{t.mira.promptPreview}</p>
            <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl bg-[#f6faff] px-3 py-2 text-xs font-medium leading-5 text-[#171c20]">{fullPrompt}</pre>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-[#bec8d1] bg-white px-3 py-2.5 text-xs font-black text-[#171c20]"
              onClick={copyPrompt}
              type="button"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? t.mira.copied : t.mira.copyFullPrompt}
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-[#00658e] px-3 py-2.5 text-xs font-black text-white"
              onClick={openMira}
              type="button"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t.mira.openMira}
            </button>
          </div>

          <div className="rounded-2xl bg-[#f6faff] p-3 text-xs font-semibold leading-5 text-[#64748b]">
            {t.mira.inlineHelp}
            <p className="mt-1 font-black text-[#00658e]">{t.mira.inlineHint}</p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{t.mira.pasteResult}</p>
            <textarea
              className="mt-1 min-h-28 w-full rounded-2xl border border-[#dfe3e8] bg-[#f6faff] px-3 py-2 text-sm font-semibold outline-none focus:border-[#229ED9]"
              onChange={(event) => setPasted(event.target.value)}
              placeholder={t.mira.pastePlaceholder}
              value={pasted}
            />
            <button
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#229ED9] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!pasted.trim()}
              onClick={showReview}
              type="button"
            >
              {t.mira.showReview}
            </button>
          </div>
        </div>
      ) : null}

      {phase === "reviewed" && parsed ? <MiraReviewResult parsed={parsed} /> : null}
    </section>
  );
}

function MiraReviewResult({ parsed }: { parsed: ParsedMiraReview }) {
  const { t } = useLanguage();
  const [rawOpen, setRawOpen] = useState(false);

  if (!parsed.ok) {
    return (
      <div className="mt-4 rounded-2xl border border-[#f0c0c8] bg-[#fff5f6] p-4">
        <p className="text-xs font-black uppercase tracking-[0.5px] text-[#9f1239]">{t.mira.unstructured}</p>
        <pre className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-5 text-[#171c20]">{parsed.raw}</pre>
      </div>
    );
  }

  const { review } = parsed;

  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-[#dfe3e8] bg-[#f9fcff] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{t.mira.clarityScore}</p>
          <p className="mt-1 text-2xl font-black text-[#171c20]">
            {review.clarityScore !== null ? `${review.clarityScore}/100` : t.mira.none}
          </p>
        </div>
        {review.riskLevel ? <AiRiskBadge risk={review.riskLevel} /> : null}
      </div>

      <ReviewList title={t.mira.missingItems} items={review.missingItems} />
      <ReviewList title={t.mira.suggestedTerms} items={review.suggestedTerms} />
      <ReviewList title={t.mira.disputeChecklist} items={review.disputeChecklist} />

      {review.finalRecommendation ? (
        <div>
          <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{t.mira.finalRecommendation}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#171c20]">{review.finalRecommendation}</p>
        </div>
      ) : null}

      <div>
        <button
          className="text-xs font-black text-[#00658e] underline"
          onClick={() => setRawOpen((open) => !open)}
          type="button"
        >
          {t.mira.rawResponse}
        </button>
        {rawOpen ? (
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl bg-white px-3 py-2 text-xs font-medium leading-5 text-[#64748b]">{parsed.raw}</pre>
        ) : null}
      </div>
    </div>
  );
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.5px] text-[#64748b]">{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm font-semibold leading-5 text-[#171c20]">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
