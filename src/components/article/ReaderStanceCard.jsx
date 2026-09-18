import React, { useState } from "react";

export default function ReaderStanceCard({ readerStance, onOpenComments, className = "" }) {
  const [commentLikes, setCommentLikes] = useState({});

  if (!readerStance) return null;

  const title = readerStance.title || readerStance.pollTitle || "इस मुद्दे पर पाठकों का रुख";
  const responseCount = readerStance.responseCount || 62;
  const percentage = readerStance.percentage || readerStance.supportPercent || 64;
  const percentageLabel = readerStance.percentageLabel || readerStance.supportLabel || "व्यावसायिक गतिविधियों पर सख्ती के पक्ष में";
  const tags = readerStance.tags || readerStance.themeTags || ["स्थानीय मुद्दा", "शहर की योजना", "व्यापारियों की चिंता", "नियमों का पालन"];

  const defaultComments = [
    {
      id: "c1",
      initial: "R",
      name: "राहुल शर्मा",
      text: "यह एक बहुत जरूरी पहल है। हमारे शहर में ऐसी सुविधाओं की काफी समय से ज़रूरत थी...",
      likes: 18,
    },
    {
      id: "c2",
      initial: "S",
      name: "स्नेहा चौहान",
      text: "स्थानीय प्रशासन को भी अब इस दिशा में जल्दी काम करना चाहिए। युवाओं के लिए...",
      likes: 12,
    },
    {
      id: "c3",
      initial: "A",
      name: "अमित वर्मा",
      text: "अगर यह योजना सही तरीके से लागू होती है तो हमारे शहर की तस्वीर बदल सकती है...",
      likes: 7,
    },
    {
      id: "c4",
      initial: "P",
      name: "पूजा मिश्रा",
      text: "बहुत अच्छा कदम है। उम्मीद है कि इसे ज़मीन पर भी अच्छे से लागू किया जाएगा...",
      likes: 6,
    },
  ];

  const comments = readerStance.previewComments || readerStance.topComments || defaultComments;

  const toggleCommentLike = (id, defaultLikes) => {
    setCommentLikes((prev) => {
      const current = prev[id] !== undefined ? prev[id] : defaultLikes;
      const isLiked = prev[`${id}_liked`];
      return {
        ...prev,
        [id]: isLiked ? current - 1 : current + 1,
        [`${id}_liked`]: !isLiked,
      };
    });
  };

  return (
    <div className={`rounded-[24px] bg-gradient-to-b from-[#EBF3FC] via-[#F8FAFC] to-[#FFF7EC] border border-[#E2E8F0] p-5 shadow-xs ${className}`}>
      {/* Header: Title + Dark Navy Pill Badge (Screenshot 2 & 3) */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-bold text-[#1E213D]">
          {title}
        </h3>
        <button
          type="button"
          onClick={onOpenComments}
          className="bg-[#1E213D] hover:bg-[#22334F] text-white text-[12px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs active:scale-95 transition-transform"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
          </svg>
          {responseCount} प्रतिक्रियाएं
        </button>
      </div>

      {/* Progress Bar: Amber 64% fill on light track (Screenshot 2 & 3) */}
      <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden flex my-3.5">
        <div
          className="h-full bg-[#D9822B] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Big Stat Row: 64% and Subtitle */}
      <div className="mb-4">
        <div className="text-[38px] font-black text-[#1E213D] leading-none tracking-tight">
          {percentage}%
        </div>
        <p className="text-[13.5px] text-[#475569] font-medium mt-1">
          {percentageLabel}
        </p>
      </div>

      {/* Reader Themes Section: 👥 पाठकों की प्रमुख राय : */}
      <div className="mb-4">
        <div className="text-[13px] font-semibold text-[#1E213D] flex items-center gap-1.5 mb-2.5">
          <span className="text-[15px]">👥</span> पाठकों की प्रमुख राय :
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-white border border-[#E2E8F0] text-[#475569] text-[12px] font-medium px-3 py-1.5 rounded-[8px] shadow-2xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* AI Review Banner: ✨ AI सारांश • नवभारत द्वारा समीक्षित */}
      <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#64748B] font-medium my-4">
        <span className="text-[#D9822B] text-sm">✦</span>
        <span>AI सारांश • नवभारत द्वारा समीक्षित</span>
      </div>

      {/* Top Comment Previews (4 exact cards matching Screenshots 2 & 3) */}
      <div className="space-y-2.5">
        {comments.map((c) => {
          const currentLikes =
            commentLikes[c.id] !== undefined
              ? commentLikes[c.id]
              : c.likes || c.likeCount || 0;
          const isLiked = commentLikes[`${c.id}_liked`];
          const initial = c.initial || c.avatarInitial || (c.name ? c.name.charAt(0) : "R");

          return (
            <div
              key={c.id}
              onClick={onOpenComments}
              className="bg-white rounded-[16px] p-3.5 border border-[#F1F5F9] shadow-xs flex items-start gap-3 cursor-pointer hover:border-slate-300 transition-colors"
            >
              {/* Dark Navy Avatar Circle */}
              <div className="w-10 h-10 rounded-full bg-[#1E213D] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                {initial}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <h5 className="text-[14px] font-bold text-[#1E213D] leading-tight">
                  {c.name || c.userName}
                </h5>
                <p className="text-[12px] text-[#64748B] leading-snug mt-1 line-clamp-2">
                  {c.text || c.comment}
                </p>
              </div>

              {/* Thumbs Up Like Button & Count Stacked Vertically (Screenshot 2 & 3) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCommentLike(c.id, c.likes || c.likeCount || 0);
                }}
                className="flex flex-col items-center justify-center shrink-0 pt-0.5 text-[#64748B] hover:text-[#1E213D] active:scale-90 transition-transform cursor-pointer"
              >
                <svg
                  className={`w-4 h-4 transition-colors ${
                    isLiked
                      ? "fill-[#D9822B] text-[#D9822B]"
                      : "fill-none stroke-current"
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                  />
                </svg>
                <span
                  className={`text-[11px] font-medium mt-0.5 ${
                    isLiked ? "text-[#D9822B] font-bold" : "text-[#64748B]"
                  }`}
                >
                  {currentLikes}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
