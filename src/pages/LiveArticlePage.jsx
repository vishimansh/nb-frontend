import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Location } from "iconsax-react";

import { getArticleDataById, isArticleLive } from "../data/articleDataResolver";
import { useSavedArticles } from "../context/SavedArticlesContext";
import LiveArticleHero from "../components/article/LiveArticleHero";
import UpdateCountBar from "../components/article/UpdateCountBar";
import AISummaryCard from "../components/article/AISummaryCard";
import LiveUpdatesSection from "../components/article/LiveUpdatesSection";
import ArticleTextBlock from "../components/article/ArticleTextBlock";
import ArticleInlineImage from "../components/article/ArticleInlineImage";
import QuoteCard from "../components/article/QuoteCard";
import InfographicCard from "../components/article/InfographicCard";
import SubArticle from "../components/article/SubArticle";
import PersonalizationPrompt from "../components/article/PersonalizationPrompt";
import ReaderStanceCard from "../components/article/ReaderStanceCard";
import CommentSheet from "../components/videos/CommentSheet";
import SearchNewsCard from "../components/search/SearchNewsCard";
import NativeFeedAd from "../components/home/NativeFeedAd";

/**
 * Editorial Placement Rules:
 * 1. STRICT RULE: In any news article screen, two images should NEVER come one after another.
 *    - Inline images and image-bearing sub-articles must never be consecutive.
 *    - An image block should NEVER be at the start of the article body (body must open with text).
 * 2. Feature Cards (quote & infographic):
 *    - The opinion (quote) and infographic card should NEVER be one after the other.
 *    - They should NEVER be at the start of the article.
 *    - They should NEVER be at the end of the article.
 */
function enforceEditorialPlacement(blocks = []) {
  if (!blocks || blocks.length <= 1) return blocks;

  const isFeatureCard = (b) => b?.type === "quote" || b?.type === "infographic";
  const isImageBlock = (b) => {
    if (!b) return false;
    if (b.type === "inlineImage" || b.type === "image") return true;
    if (b.type === "subArticle") {
      return (
        (Array.isArray(b.images) && b.images.length > 0) ||
        (Array.isArray(b.items) && b.items.some((it) => it.type === "image" || it.type === "inlineImage"))
      );
    }
    return false;
  };
  const isTextBlock = (b) =>
    b?.type === "paragraph" || b?.type === "text" || b?.type === "heading";

  let list = [...blocks];

  // Rule 1: Neither feature card nor image block at the very start of the article body
  while (list.length > 1 && (isFeatureCard(list[0]) || isImageBlock(list[0]))) {
    const card = list.shift();
    const firstTextIdx = list.findIndex(isTextBlock);
    if (firstTextIdx !== -1) {
      list.splice(firstTextIdx + 1, 0, card);
    } else {
      list.push(card);
      break;
    }
  }

  // Rule 2: Neither opinion nor infographic at the very end of the article
  while (list.length > 1 && isFeatureCard(list[list.length - 1])) {
    const card = list.pop();
    let lastNonCardIdx = -1;
    for (let i = list.length - 1; i >= 0; i--) {
      if (!isFeatureCard(list[i])) {
        lastNonCardIdx = i;
        break;
      }
    }
    if (lastNonCardIdx > 0) {
      list.splice(lastNonCardIdx, 0, card);
    } else {
      list.unshift(card);
      break;
    }
  }

  // Rule 3: Feature cards (quote & infographic) must NEVER be one after the other
  for (let i = 0; i < list.length - 1; i++) {
    if (isFeatureCard(list[i]) && isFeatureCard(list[i + 1])) {
      const nonCardIdx = list.findIndex((b, idx) => idx > i + 1 && !isFeatureCard(b));
      if (nonCardIdx !== -1) {
        const [separatedBlock] = list.splice(nonCardIdx, 1);
        list.splice(i + 1, 0, separatedBlock);
      }
    }
  }

  // Rule 4: CRITICAL RULE - Two images should NEVER come one after another
  // If list[i] and list[i+1] both contain images, separate them with an intervening non-image block
  for (let i = 0; i < list.length - 1; i++) {
    if (isImageBlock(list[i]) && isImageBlock(list[i + 1])) {
      // Look for the next non-image block ahead
      const nonImageIdx = list.findIndex((b, idx) => idx > i + 1 && !isImageBlock(b));
      if (nonImageIdx !== -1) {
        const [separator] = list.splice(nonImageIdx, 1);
        list.splice(i + 1, 0, separator);
      } else {
        // Fallback: look for an earlier non-image block (that is not the lead block)
        const earlierIdx = list.findIndex((b, idx) => idx < i && !isImageBlock(b) && !b.isLead);
        if (earlierIdx !== -1) {
          const [separator] = list.splice(earlierIdx, 1);
          list.splice(i + 1, 0, separator);
        }
      }
    }
  }

  // Final Strict Invariant: Under NO circumstances allow consecutive image blocks
  const result = [];
  for (let i = 0; i < list.length; i++) {
    const current = list[i];
    const prev = result[result.length - 1];
    if (isImageBlock(current) && isImageBlock(prev)) {
      // Discard consecutive image to preserve layout integrity
      continue;
    }
    result.push(current);
  }

  return result;
}

export default function LiveArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollRef = useRef(null);

  // Dynamically resolve article data (supporting top stories, search, city, and specialized cards)
  const article = useMemo(() => getArticleDataById(id), [id]);

  // Strictly enforce that ONLY 2 news cards in the application are live update news:
  // 1. The hero feed card ('hero-101' / 'live-bhopal-encroachment')
  // 2. The search screen first card ('sn-1')
  // Rest all are normal news cards.
  const isLive = useMemo(() => isArticleLive(id, searchParams), [id, searchParams]);

  const processedBodyBlocks = useMemo(
    () => enforceEditorialPlacement(article.bodyBlocks),
    [article.bodyBlocks]
  );

  // Interleaved items for "जुड़ी हुई खबरें": editorial articles, sponsored articles, and native feed AD cards
  const interleavedRelatedItems = useMemo(() => {
    const stories = article.relatedStories || [];
    if (!stories.length) return [];

    const sponsoredStories = [
      {
        id: "sp-1",
        headline: "टाटा मोटर्स ने पेश की नई नेक्सन ईवी: 489 किमी रेंज और अल्ट्रा-फास्ट चार्जिंग का नया मानक",
        category: { id: "auto", label: "ऑटो", color: "#596776" },
        location: "ऑटो",
        thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&auto=format&fit=crop&q=80",
        timestamp: "प्रायोजित",
        readTimeMinutes: 2,
        isSponsored: true,
      },
      {
        id: "sp-2",
        headline: "एसबीआई का नया डिजिटल होम लोन समाधान: न्यूनतम ब्याज दर और तत्काल सैद्धांतिक मंजूरी",
        category: { id: "business", label: "बिज़नेस", color: "#497877" },
        location: "बैंकिंग",
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80",
        timestamp: "प्रायोजित",
        readTimeMinutes: 3,
        isSponsored: true,
      },
    ];

    const feedAdBanners = [
      {
        id: "feed-ad-concert",
        ad: { id: "ad-concert" },
        brand: "terra × SCENE",
      },
      {
        id: "feed-ad-hospital",
        ad: { id: "ad-hospital" },
        brand: "Bhopal Children's Hospital",
      },
    ];

    const items = [];
    let spIdx = 0;
    let adIdx = 0;

    stories.forEach((story, idx) => {
      // Add regular editorial story
      items.push({ itemType: 'story', id: story.id || `rel-${idx}`, data: story });

      // After 1st editorial story: Sponsored article 1
      if (idx === 0 && spIdx < sponsoredStories.length) {
        items.push({ itemType: 'story', id: sponsoredStories[spIdx].id, data: sponsoredStories[spIdx] });
        spIdx++;
      }
      // After 2nd editorial story: Feed AD card 1
      else if (idx === 1 && adIdx < feedAdBanners.length) {
        items.push({ itemType: 'feed-ad', id: feedAdBanners[adIdx].id, data: feedAdBanners[adIdx] });
        adIdx++;
      }
      // After 3rd editorial story: Sponsored article 2
      else if (idx === 2 && spIdx < sponsoredStories.length) {
        items.push({ itemType: 'story', id: sponsoredStories[spIdx].id, data: sponsoredStories[spIdx] });
        spIdx++;
      }
      // After 4th editorial story: Feed AD card 2
      else if (idx === 3 && adIdx < feedAdBanners.length) {
        items.push({ itemType: 'feed-ad', id: feedAdBanners[adIdx].id, data: feedAdBanners[adIdx] });
        adIdx++;
      }
    });

    return items;
  }, [article.relatedStories]);

  const { isArticleSaved, toggleSaveArticle } = useSavedArticles();

  const articleHeadline =
    article.headline ||
    article.hero?.caption ||
    article.subheading ||
    "सुप्रीम कोर्ट का अहम फैसला, राज्यों को नागरिक डेटा सुरक्षा पर सख्त दिशानिर्देश";

  const articleCardData = useMemo(() => ({
    id: article.id || id,
    headline: articleHeadline,
    thumbnail: article.hero?.imageUrl || null,
    category: article.category || "देश",
    publishedAgo: article.publishedAgo || article.lastUpdated || "20 मिनट पहले",
    readTime: article.readTime || "3 मिनट पढ़ें",
  }), [article, id, articleHeadline]);

  const isBookmarked = isArticleSaved(article.id || id);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [readProgress, setReadProgress] = useState(0);

  // Smoothly reset scroll and reading progress on article navigation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
    setReadProgress(0);
  }, [id]);

  // Compute article reading progress from scroll position (0% to 100%)
  const handleScroll = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setReadProgress(pct);
    } else {
      setReadProgress(0);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleBookmark = () => {
    const nextSaved = toggleSaveArticle(articleCardData);
    showToast(nextSaved ? "खबर सुरक्षित कर ली गई है" : "खबर हटा दी गई है");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.headline,
          text: article.subheading,
          url: window.location.href,
        });
      } catch (e) {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast("लिंक कॉपी कर लिया गया है");
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/feed");
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] text-[#2B2437] font-sans antialiased relative overflow-hidden select-none flex flex-col">
      {/* Hardware Status Bar Clearance (66px) - Uses the exact background of the article */}
      <div className="h-[66px] w-full bg-[#F7F7F4] shrink-0 z-30" />

      {/* Article Reading Completion Bar (0% to 100% width) */}
      <div className="absolute top-[66px] inset-x-0 h-[4px] bg-black/5 z-40 pointer-events-none">
        <div
          className="h-full bg-[#2B2437] transition-[width] duration-75 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Toast Alert: Centered vertically and horizontally */}
      {toastMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
          <div className="bg-[#2B2437]/95 backdrop-blur-xs text-white text-[13px] font-medium px-5 py-2.5 rounded-full shadow-2xl border border-white/10 animate-fadeIn pointer-events-auto">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Vertically Scrollable Article Canvas with Buttery Smooth Inertia */}
      <main
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto scrollbar-none overscroll-y-contain scroll-smooth smooth-scroll"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* 1. Hero Container (402:320 with optional live pill, bookmark, 3-dots, caption) */}
        <LiveArticleHero
          hero={article.hero}
          isLive={isLive}
          onBack={handleBack}
          isBookmarked={isBookmarked}
          onToggleBookmark={handleToggleBookmark}
          onShare={handleShare}
          articleId={id}
          articleData={articleCardData}
        />

        {/* Content Body Container (1. Proportional Hero Container -> Metadata Row: 16px) */}
        <div className="px-4 pt-[16px] max-w-[402px] mx-auto pb-10">
          {/* Row 1: [📍 भोपाल] Pill + Metadata Timestamp (12px gap below) */}
          <div className="flex items-center justify-between gap-2 mb-[12px]">
            <div className="flex items-center gap-1.5 bg-[#2B2437] text-white text-[14px] font-medium p-[8px] rounded-full shadow-2xs leading-none">
              <Location size={16} color="#F5B55C" variant="Bold" />
              <span className="pr-1">{article.location || "भोपाल"}</span>
            </div>

            {/* Normal: "20 मिनट पहले • 3 मिनट पढ़ें" | Live: "आखिरी अपडेट: 20 मिनट पहले • 3 मिनट पढ़ें" */}
            <div className="text-[12px] font-medium flex items-center gap-1.5">
              {isLive ? (
                <span className="text-[#F5B55C]">आखिरी अपडेट: {article.lastUpdated || "20 मिनट पहले"}</span>
              ) : (
                <span className="text-[#64748B]">{article.publishedAgo || article.lastUpdated || "20 मिनट पहले"}</span>
              )}
              <span className="text-[#94A3B8]">• {article.readTime || "3 मिनट पढ़ें"}</span>
            </div>
          </div>

          {/* Row 2: रिपोर्ट: रोहित शर्मा • भोपाल संवाददाता (16px gap if live count bar follows, 32px gap if normal) */}
          <div className={`flex items-center text-[12px] leading-tight ${isLive ? 'mb-[16px]' : 'mb-[32px]'}`}>
            <span className="text-[#F5B55C] font-bold">रिपोर्ट:&nbsp;</span>
            <span className="text-[#2B2437] font-bold">{article.reporter?.name || "रोहित शर्मा"}</span>
            <span className="text-[#64748B] font-medium">&nbsp;• {article.reporter?.role || "भोपाल संवाददाता"}</span>
          </div>

          {/* 2. Number of Times Updated Section (UpdateCountBar) - Only for Live News Articles */}
          {isLive && (
            <UpdateCountBar
              updateCount={article.updateCount || 8}
              text={`यह खबर ${article.updateCount || 8} बार अपडेट की जा चुकी है`}
              onRefresh={() => showToast("ताज़ा अपडेट जांचे जा रहे हैं...")}
              className="mb-[32px]"
            />
          )}

          {/* 3. Article Headline & Subheading Typography (Headline -> Subheading: 32px) */}
          <div>
            <h1 className="text-[28px] font-semibold text-[#2B2437] leading-[1.3] tracking-tight mb-[32px]">
              {article.headline || "सुप्रीम कोर्ट की सख्ती के बाद भोपाल में कार्रवाई तेज, रिहायशी इलाकों में चल रहे कारोबार पर संकट"}
            </h1>
            <p className="text-[20px] font-medium text-[#64748B] leading-[1.45]">
              {article.subheading || "आवासीय क्षेत्रों में व्यावसायिक गतिविधियों को लेकर नगर निगम की कार्रवाई तेज, हजारों प्रतिष्ठानों पर पड़ सकता है असर"}
            </p>
          </div>

          {/* Section Divider Line (24px gap from section to line, and 24px gap to next section) */}
          <div className="w-full h-[1px] bg-[#E5E7EB] my-[24px]" />

          {/* 4. AI Summary Card */}
          <AISummaryCard aiSummary={article.aiSummary} />

          {/* Section Divider Line (24px gap from section to line, and 24px gap to next section) */}
          <div className="w-full h-[1px] bg-[#E5E7EB] my-[24px]" />

          {/* 5. Live Updates Section - Only for Live News Articles */}
          {isLive && article.liveUpdates && article.liveUpdates.length > 0 && (
            <>
              <LiveUpdatesSection updates={article.liveUpdates} />
              {/* Section Divider Line */}
              <div className="w-full h-[1px] bg-[#E5E7EB] my-[24px]" />
            </>
          )}

          {/* 6. CMS Body Content Blocks */}
          <div className="flex flex-col">
            {processedBodyBlocks?.map((block, idx) => {
              const isSectionOrCard = (type) =>
                type === "quote" ||
                type === "infographic" ||
                type === "subArticle" ||
                type === "heading";

              const isCurrentCard = isSectionOrCard(block.type);
              const isNextCard =
                idx < processedBodyBlocks.length - 1 &&
                isSectionOrCard(processedBodyBlocks[idx + 1].type);
              const isLastBlock = idx === processedBodyBlocks.length - 1;

              return (
                <React.Fragment key={idx}>
                  {block.type === "paragraph" || block.type === "text" ? (
                    <ArticleTextBlock
                      text={block.text}
                      isLeadParagraph={block.isLead ?? block.isLeadParagraph ?? false}
                      location={block.city || block.location || "भोपाल"}
                    />
                  ) : block.type === "heading" ? (
                    <h2 className="text-[20px] font-semibold text-[#2B2437] leading-[1.38] tracking-tight mb-3 select-text">
                      {block.text || block.title}
                    </h2>
                  ) : block.type === "inlineImage" ? (
                    <div className="my-3">
                      <ArticleInlineImage
                        image={block.imageUrl || block.image}
                        caption={block.caption}
                        location={block.location || "भोपाल"}
                        onShare={handleShare}
                      />
                    </div>
                  ) : block.type === "quote" ? (
                    <QuoteCard
                      quote={block.quote}
                      authorName={block.authorName}
                      authorTitle={block.authorTitle}
                      authorPhoto={block.authorPhoto}
                    />
                  ) : block.type === "infographic" ? (
                    <InfographicCard
                      title={block.title}
                      subtitle={block.subtitle}
                      points={block.points}
                      bigPicture={block.bigPicture}
                    />
                  ) : block.type === "subArticle" ? (
                    <SubArticle
                      title={block.title}
                      paragraphs={block.paragraphs}
                      images={block.images}
                      items={block.items}
                      onShare={handleShare}
                    />
                  ) : null}

                  {/* 24px divider line before/after major cards, sub-articles, or at end of body blocks */}
                  {(isCurrentCard || isNextCard || isLastBlock) && (
                    <div className="w-full h-[1px] bg-[#E5E7EB] my-[24px]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* 7. Personalization Prompt ("ज्यादा" / "कम" with toast feedback) */}
          <PersonalizationPrompt
            onFeedback={(choice) => {
              console.log("Feedback recorded:", choice);
            }}
          />

          {/* Section Divider Line (24px gap from section to line, and 24px gap to next section) */}
          <div className="w-full h-[1px] bg-[#E5E7EB] my-[24px]" />

          {/* 8. Reader Stance Poll Card */}
          <ReaderStanceCard
            readerStance={article.readerStance}
            onOpenComments={() => setIsCommentsOpen(true)}
          />

          {/* Section Divider Line (24px gap from section to line, and 24px gap to next section) */}
          <div className="w-full h-[1px] bg-[#E5E7EB] my-[24px]" />

          {/* 9. Related News Section ("जुड़ी हुई खबरें") */}
          {interleavedRelatedItems && interleavedRelatedItems.length > 0 && (
            <section className="mb-4">
              <h3 className="text-[20px] font-bold text-[#2B2437] mb-3.5 px-0.5">
                जुड़ी हुई खबरें
              </h3>

              <div className="flex flex-col gap-3 items-center w-full">
                {interleavedRelatedItems.map((item) => {
                  if (item.itemType === 'feed-ad') {
                    return (
                      <div key={item.id} className="w-full flex justify-center my-0.5">
                        <NativeFeedAd
                          ad={item.data.ad}
                          onClick={(adInfo) => {
                            showToast(`${adInfo.brand || "विज्ञापन"}: अधिक जानकारी जल्द उपलब्ध होगी`);
                          }}
                          className="w-[370px] min-w-[370px] max-w-[370px]"
                        />
                      </div>
                    );
                  }

                  const story = item.data;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (scrollRef.current) {
                          scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        navigate(`/article/${story.id}`);
                      }}
                      className="cursor-pointer active:scale-[0.99] transition-transform w-full flex justify-center"
                    >
                      <SearchNewsCard story={story} />
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>



      {/* 10. Dynamic Comment Sheet */}
      <CommentSheet
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        title={article.headline || "पाठकों की प्रतिक्रियाएं"}
        comments={
          article.readerStance?.previewComments?.map((c, i) => ({
            id: c.id || `c-${i}`,
            username: c.name || c.userName || "पाठक",
            text: c.text || c.comment || "",
            timeAgo: c.timeAgo || `${(i + 1) * 15} मिनट पहले`,
            likes: c.likes || c.likeCount || 0,
            isLiked: false,
          })) || []
        }
      />
    </div>
  );
}
