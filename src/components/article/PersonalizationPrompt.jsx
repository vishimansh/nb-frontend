import React, { useState } from "react";

export default function PersonalizationPrompt({ onFeedback, className = "" }) {
  const [selected, setSelected] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleChoice = (choice) => {
    setSelected(choice);
    const msg =
      choice === "more"
        ? "आपकी पसंद दर्ज कर ली गई है। हम आपको ऐसी और खबरें दिखाएंगे।"
        : "आपकी पसंद दर्ज कर ली गई है। हम इस विषय की खबरें कम करेंगे।";
    setToastMessage(msg);
    if (onFeedback) onFeedback(choice);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <div className={`rounded-[20px] bg-[#5F6672] text-white p-5 text-center shadow-sm ${className}`}>
      <h4 className="text-[15px] font-semibold text-white tracking-normal">
        इस तरह की और खबरें चाहिए?
      </h4>

      {/* Two equal-sized pill buttons matching Screenshots 2 & 3 */}
      <div className="flex items-center justify-center gap-3 mt-3.5 max-w-[280px] mx-auto w-full">
        <button
          type="button"
          onClick={() => handleChoice("more")}
          className={`flex-1 py-2.5 px-6 rounded-[10px] text-[14px] font-bold transition-all active:scale-95 text-center ${
            selected === "more"
              ? "bg-[#D9822B] text-white ring-2 ring-white/40 shadow-sm"
              : "bg-[#D9822B] hover:bg-[#C77422] text-white shadow-xs"
          }`}
        >
          ज्यादा
        </button>

        <button
          type="button"
          onClick={() => handleChoice("less")}
          className={`flex-1 py-2.5 px-6 rounded-[10px] text-[14px] font-medium transition-all active:scale-95 text-center border ${
            selected === "less"
              ? "bg-white/20 border-white text-white"
              : "bg-transparent border-white/60 hover:bg-white/10 text-white"
          }`}
        >
          कम
        </button>
      </div>

      {/* Inline Toast Notification */}
      {toastMessage && (
        <div className="mt-3 pt-2.5 border-t border-white/15 text-[12px] text-amber-200 text-center animate-fadeIn font-medium">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
