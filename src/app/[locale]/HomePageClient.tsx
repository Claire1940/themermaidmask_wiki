"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Drama,
  Film,
  Fingerprint,
  Lightbulb,
  ListChecks,
  Map,
  MapPin,
  MonitorSmartphone,
  Puzzle,
  Quote,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

// Tools Grid navigation card -> section id mapping
const TOOL_SECTION_IDS = [
  "walkthrough",
  "puzzle-solutions",
  "beginner-guide",
  "characters-and-suspects",
  "clues-and-evidence",
  "achievements-guide",
  "ending-explained",
  "platforms-and-system-requirements",
];

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.themermaidmask.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "The Mermaid Mask Wiki",
        description:
          "Complete The Mermaid Mask Wiki covering the full walkthrough, puzzle solutions, clues, suspects, achievements, endings, characters, and Mortuga submarine locations.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "The Mermaid Mask - Hand-Painted Submarine Murder Mystery",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "The Mermaid Mask Wiki",
        alternateName: "The Mermaid Mask",
        url: siteUrl,
        description:
          "Complete The Mermaid Mask Wiki resource hub for walkthroughs, puzzles, clues, suspects, achievements, and Mortuga submarine locations",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "The Mermaid Mask Wiki - Hand-Painted Submarine Murder Mystery",
        },
        sameAs: [
          "https://store.steampowered.com/app/1696770/The_Mermaid_Mask/",
          "https://www.youtube.com/user/DetectiveGrimoire",
          "https://www.reddit.com/r/TangleTower/",
          "https://x.com/SFBTom",
        ],
      },
      {
        "@type": "VideoGame",
        name: "The Mermaid Mask",
        gamePlatform: ["PC", "Steam", "PlayStation 5", "Nintendo Switch"],
        applicationCategory: "Game",
        genre: ["Adventure", "Mystery", "Point-and-Click", "Puzzle"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1696770/The_Mermaid_Mask/",
        },
      },
      {
        "@type": "VideoObject",
        name: "The Mermaid Mask | Official Launch Trailer",
        description:
          "Official The Mermaid Mask launch trailer from SFB Games, the hand-painted submarine murder mystery out now on PC, PS5 and Nintendo Switch.",
        uploadDate: "2026-07-16",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/lGzSjY6AwIw",
        url: "https://www.youtube.com/watch?v=lGzSjY6AwIw",
      },
    ],
  };

  // Accordion state (Ending Explained module)
  const [endingExpanded, setEndingExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1696770/The_Mermaid_Mask/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="lGzSjY6AwIw"
              title="The Mermaid Mask | Official Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (Module Navigation) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: The Mermaid Mask Walkthrough */}
      <section id="walkthrough" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Map className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskWalkthrough.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskWalkthrough.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskWalkthrough.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskWalkthrough.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-8">
            {t.modules.theMermaidMaskWalkthrough.chapters.map(
              (chapter: any, ci: number) => (
                <div key={ci}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[hsl(var(--nav-theme))] text-white text-sm font-bold">
                      {ci + 1}
                    </span>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">
                        {chapter.chapter}: {chapter.chapterTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {chapter.spoilerLevel}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 pl-2 md:pl-12 border-l-2 border-[hsl(var(--nav-theme)/0.2)]">
                    {chapter.sections.map((section: any, si: number) => (
                      <div key={si}>
                        <h4 className="font-bold text-base md:text-lg mb-3 text-[hsl(var(--nav-theme-light))]">
                          {section.sectionTitle}
                        </h4>
                        <div className="space-y-3">
                          {section.steps.map((step: any, sti: number) => (
                            <div
                              key={sti}
                              className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                            >
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {step.location}
                                </span>
                              </div>
                              <p className="font-semibold text-sm md:text-base mb-2">
                                {step.objective}
                              </p>
                              <ul className="space-y-1.5 mb-2">
                                {step.actions.map((action: string, ai: number) => (
                                  <li
                                    key={ai}
                                    className="flex items-start gap-2 text-sm text-muted-foreground"
                                  >
                                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm">
                                <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                                  Trigger:{" "}
                                </span>
                                <span className="text-muted-foreground">
                                  {step.trigger}
                                </span>
                              </p>
                              {step.spoilerWarning && (
                                <p className="text-xs text-muted-foreground italic mt-2">
                                  {step.spoilerWarning}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: The Mermaid Mask Puzzle Solutions */}
      <section
        id="puzzle-solutions"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Puzzle className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskPuzzleSolutions.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskPuzzleSolutions.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskPuzzleSolutions.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskPuzzleSolutions.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.theMermaidMaskPuzzleSolutions.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item.chapter}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border">
                      {item.room}
                    </span>
                  </div>
                  <h3 className="font-bold text-base md:text-lg mb-3">
                    {item.puzzle}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Hint:{" "}
                      </span>
                      <span className="text-muted-foreground">{item.hint}</span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Solution:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.solution}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Reward:{" "}
                      </span>
                      <span className="text-muted-foreground">{item.reward}</span>
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: The Mermaid Mask Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskBeginnerGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskBeginnerGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.theMermaidMaskBeginnerGuide.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <h3 className="font-bold text-base md:text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.summary}
                  </p>
                  <ul className="space-y-1.5">
                    {item.tips.map((tip: string, ti: number) => (
                      <li
                        key={ti}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: The Mermaid Mask Characters and Suspects */}
      <section
        id="characters-and-suspects"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskCharactersAndSuspects.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskCharactersAndSuspects.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskCharactersAndSuspects.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskCharactersAndSuspects.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.theMermaidMaskCharactersAndSuspects.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-base md:text-lg">
                      {item.name}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Location: {item.location}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      Testimony:{" "}
                    </span>
                    <span className="text-muted-foreground">{item.testimony}</span>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      Investigative angle:{" "}
                    </span>
                    <span className="text-muted-foreground">{item.motive}</span>
                  </p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-[hsl(var(--nav-theme-light))] mb-1">
                      Key evidence
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.evidence.map((ev: string, ei: number) => (
                        <span
                          key={ei}
                          className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: The Mermaid Mask Clues and Evidence */}
      <section id="clues-and-evidence" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Fingerprint className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskCluesAndEvidence.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskCluesAndEvidence.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskCluesAndEvidence.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskCluesAndEvidence.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.theMermaidMaskCluesAndEvidence.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-base md:text-lg">
                      {item.name}
                    </h3>
                    {item.required && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                      {item.chapter}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                      {item.room}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm mb-1">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      Found by:{" "}
                    </span>
                    <span className="text-muted-foreground">{item.foundBy}</span>
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      Examination:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {item.examination}
                    </span>
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      Unlocks:{" "}
                    </span>
                    <span className="text-muted-foreground">{item.unlocks}</span>
                  </p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-[hsl(var(--nav-theme-light))] mb-1">
                      Linked suspects
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.suspects.map((s: string, si: number) => (
                        <span
                          key={si}
                          className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: The Mermaid Mask Achievements Guide */}
      <section
        id="achievements-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskAchievementsGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskAchievementsGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskAchievementsGuide.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskAchievementsGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.theMermaidMaskAchievementsGuide.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm md:text-base">
                      {item.name}
                    </h3>
                    {item.hidden && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">
                        Hidden
                      </span>
                    )}
                    {item.missable && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                        Missable
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center gap-1">
                      <ListChecks className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border">
                      {item.chapter}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <p className="text-xs mb-2">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      How to unlock:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {item.howToUnlock}
                    </span>
                  </p>
                  <p className="text-xs">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      Cleanup:{" "}
                    </span>
                    <span className="text-muted-foreground">{item.cleanup}</span>
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: The Mermaid Mask Ending Explained */}
      <section id="ending-explained" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <Drama className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskEndingExplained.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskEndingExplained.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskEndingExplained.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskEndingExplained.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2">
            {t.modules.theMermaidMaskEndingExplained.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setEndingExpanded(endingExpanded === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-2">
                      <Quote className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${endingExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {endingExpanded === index && (
                    <div className="px-5 pb-5">
                      <p className="text-muted-foreground text-sm mb-2">
                        {item.answer}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border text-muted-foreground">
                        {item.spoiler}
                      </span>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: The Mermaid Mask Platforms and System Requirements */}
      <section
        id="platforms-and-system-requirements"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
              <MonitorSmartphone className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium tracking-wide">
                {t.modules.theMermaidMaskPlatformsAndSystemRequirements.eyebrow}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.theMermaidMaskPlatformsAndSystemRequirements.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              {t.modules.theMermaidMaskPlatformsAndSystemRequirements.subtitle}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
              {t.modules.theMermaidMaskPlatformsAndSystemRequirements.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.theMermaidMaskPlatformsAndSystemRequirements.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-base md:text-lg">
                      {item.platform}
                    </h3>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Release:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.releaseDate}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Availability:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.availability}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Format:{" "}
                      </span>
                      <span className="text-muted-foreground">{item.format}</span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Controls:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.controls}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Languages:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.languages}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Achievements:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.achievements}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Review:{" "}
                      </span>
                      <span className="text-muted-foreground">{item.review}</span>
                    </p>
                    <p>
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Requirements:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.requirements}
                      </span>
                    </p>
                    <p className="pt-1">
                      <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                        Best for:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {item.bestFor}
                      </span>
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.youtube.com/user/DetectiveGrimoire"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/SFBTom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1696770"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/TangleTower/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
