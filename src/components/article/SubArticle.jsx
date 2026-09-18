import React, { useMemo } from 'react';
import ArticleTextBlock from './ArticleTextBlock';
import ArticleInlineImage from './ArticleInlineImage';

/**
 * SubArticle:
 * Sub-article component inside a long-form article.
 * 
 * CRITICAL EDITORIAL RULE:
 * In any news article screen, two images should NEVER come one after another.
 * 
 * This component strictly interleaves paragraphs and images (Text -> Image -> Text -> Image)
 * and sanitizes the output so that two images are never displayed consecutively.
 */
export default function SubArticle({
  title,
  paragraphs = [],
  images = [],
  items = [],
  onShare,
  className = "",
  children,
}) {
  // Assemble elements ensuring two images never appear back-to-back
  const elements = useMemo(() => {
    let raw = [];

    if (items && items.length > 0) {
      raw = items;
    } else {
      // Interleave: Paragraph 0 -> Image 0 -> Paragraph 1 -> Image 1 -> Paragraph 2 ...
      const paras = [...paragraphs];
      const imgs = [...images];
      let pIdx = 0;
      let iIdx = 0;

      while (pIdx < paras.length || iIdx < imgs.length) {
        // Add paragraph first
        if (pIdx < paras.length) {
          raw.push({
            type: 'paragraph',
            text: typeof paras[pIdx] === 'string' ? paras[pIdx] : paras[pIdx].text,
          });
          pIdx++;
        }

        // Add image only if available AND last added block was not an image
        if (iIdx < imgs.length) {
          const last = raw[raw.length - 1];
          const lastIsImg = last && (last.type === 'image' || last.type === 'inlineImage');
          if (!lastIsImg) {
            raw.push({
              type: 'inlineImage',
              ...(typeof imgs[iIdx] === 'string' ? { imageUrl: imgs[iIdx] } : imgs[iIdx]),
            });
            iIdx++;
          } else {
            // Cannot place image right now because last block is an image;
            // wait for next paragraph. If no more paragraphs exist, break to prevent consecutive images.
            if (pIdx >= paras.length) {
              break;
            }
          }
        }
      }
    }

    // Strict sanitization: ensure no two images are consecutive under any circumstances
    const sanitized = [];
    for (let i = 0; i < raw.length; i++) {
      const el = raw[i];
      const isImg = el.type === 'image' || el.type === 'inlineImage';
      const prevIsImg =
        sanitized.length > 0 &&
        (sanitized[sanitized.length - 1].type === 'image' ||
          sanitized[sanitized.length - 1].type === 'inlineImage');

      if (isImg && prevIsImg) {
        // Skip consecutive image to enforce rule
        continue;
      }
      sanitized.push(el);
    }

    return sanitized;
  }, [paragraphs, images, items]);

  return (
    <section className={`sub-article flex flex-col ${className}`}>
      {/* Sub-Article Headline: 20px semibold */}
      {title && (
        <h2 className="text-[20px] font-semibold text-[#1E213D] leading-[1.38] tracking-tight mb-3 select-text">
          {title}
        </h2>
      )}

      {/* Render Interleaved & Sanitized Elements */}
      {elements.map((item, idx) => {
        if (item.type === 'text' || item.type === 'paragraph') {
          return (
            <ArticleTextBlock
              key={idx}
              text={item.text}
              isLeadParagraph={false}
            />
          );
        }
        if (item.type === 'image' || item.type === 'inlineImage') {
          return (
            <div key={idx} className="my-3">
              <ArticleInlineImage
                image={item.imageUrl || item.image}
                caption={item.caption}
                location={item.location || 'भोपाल'}
                onShare={onShare}
              />
            </div>
          );
        }
        return null;
      })}

      {children}
    </section>
  );
}
