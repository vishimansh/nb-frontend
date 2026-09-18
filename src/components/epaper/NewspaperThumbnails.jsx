import React from 'react';
import supremeCourtImg from '../../assets/cards/supreme-court.jpg';
import sanchiImg from '../../assets/illustrations/mp-sanchi.jpg';
import card1Img from '../../assets/cards/card-1.png';

/**
 * High-fidelity broadsheet & magazine cover thumbnails
 * Scaled gracefully for compact 240px cards.
 */

export function NavaBharatThumbnail({ cityName = 'भोपाल', dateText = '28 अगस्त' }) {
  return (
    <div className="w-full h-full bg-[#FDFCF7] text-[#18253B] flex flex-col justify-between p-1.5 select-none overflow-hidden text-left relative font-serif">
      {/* Top Paper Header Strip */}
      <div className="border-b border-[#18253B]/20 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[6px] font-sans text-[#6B7280] font-medium tracking-tight leading-none">
          <span>वर्ष 75 • अंक 234</span>
          <span className="font-bold text-[#E39026]">{cityName}</span>
          <span>₹ 4.50</span>
        </div>

        {/* Masthead */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-black tracking-tight text-[#E31E24] leading-none font-sans">
              नवभारत
            </span>
          </div>
          <span className="text-[6px] font-sans text-[#64748B] font-medium leading-none">
            {dateText}
          </span>
        </div>
      </div>

      {/* Main Front-Page Lead Headline */}
      <div className="my-0.5 shrink-0">
        <h4 className="text-[7.5px] font-bold leading-tight text-[#0F172A] line-clamp-1">
          राज्य के विकास को मिली नई गति, बुनियादी ढांचे को मंजूरी
        </h4>
      </div>

      {/* Front-Page Image */}
      <div className="relative w-full flex-1 min-h-[44px] rounded-[3px] overflow-hidden bg-slate-200 border border-[#E2E8F0]">
        <img
          src={supremeCourtImg || card1Img}
          alt="News Story"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5">
          <p className="text-[5px] font-sans text-white font-medium truncate leading-none">
            राजधानी में उच्चस्तरीय बैठक में अहम फैसले
          </p>
        </div>
      </div>

      {/* Bottom Barcode & Footer Strip */}
      <div className="pt-0.5 mt-0.5 border-t border-[#18253B]/20 flex items-center justify-between text-[5px] text-[#94A3B8] font-sans shrink-0 leading-none">
        <div className="flex items-center gap-1">
          <div className="w-8 h-1.5 bg-gradient-to-r from-[#18253B] via-[#475569] to-[#18253B] opacity-60 rounded-[1px]" />
          <span>ISSN 0971-8257</span>
        </div>
        <span className="font-semibold text-[#18253B]">Page 01</span>
      </div>
    </div>
  );
}

export function CentralChroniclesThumbnail({ dateText = '28 अगस्त' }) {
  return (
    <div className="w-full h-full bg-[#FCFBF7] text-[#0F172A] flex flex-col justify-between p-1.5 select-none overflow-hidden text-left relative font-serif">
      {/* Top Paper Header Strip */}
      <div className="border-b border-[#0F172A]/25 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[5.5px] font-sans text-[#64748B] font-semibold uppercase leading-none">
          <span>Premier English Daily</span>
          <span>Vol. LXVIII</span>
        </div>

        {/* Masthead */}
        <div className="text-center my-0.5">
          <h3 className="text-[11px] font-black tracking-tight text-[#1E3A8A] uppercase font-serif leading-none">
            Central Chronicles
          </h3>
        </div>

        <div className="border-t border-[#0F172A]/20 pt-0.5 flex justify-between text-[5.5px] font-sans text-[#475569] leading-none">
          <span>Friday Edition</span>
          <span>{dateText}</span>
          <span>₹5.00</span>
        </div>
      </div>

      {/* Main English Lead Headline */}
      <div className="my-0.5 shrink-0">
        <h4 className="text-[7.5px] font-black font-serif leading-tight text-[#0F172A] line-clamp-1">
          Cabinet Approves ₹1.2L Cr Infrastructure Push
        </h4>
      </div>

      {/* Front-Page Image */}
      <div className="relative w-full flex-1 min-h-[44px] rounded-[3px] overflow-hidden bg-slate-200 border border-[#CBD5E1]">
        <img
          src={sanchiImg || card1Img}
          alt="Central Chronicles"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5">
          <p className="text-[5px] font-sans text-white font-medium truncate leading-none">
            Strategic investment in renewable grids cleared
          </p>
        </div>
      </div>

      {/* Bottom Barcode & Footer Strip */}
      <div className="pt-0.5 mt-0.5 border-t border-[#0F172A]/20 flex items-center justify-between text-[5px] text-[#94A3B8] font-sans shrink-0 leading-none">
        <span>RNI No. 12984/57</span>
        <span className="font-semibold text-[#1E3A8A]">City Edition</span>
      </div>
    </div>
  );
}

export function SuruchiThumbnail({ dateText = '28 अगस्त' }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE] text-[#18253B] flex flex-col justify-between p-1.5 select-none overflow-hidden text-left relative font-sans">
      {/* Top Magazine Header */}
      <div className="border-b border-[#9333EA]/30 pb-0.5 shrink-0">
        <div className="flex items-center justify-between text-[5.5px] font-bold text-[#7E22CE] leading-none">
          <span className="bg-[#9333EA] text-white px-1 py-0.2 rounded-xs">
            साप्ताहिक विशेषांक
          </span>
          <span>{dateText}</span>
        </div>

        {/* Masthead */}
        <div className="mt-0.5 flex items-baseline justify-between">
          <h3 className="text-[14px] font-black tracking-tight text-[#7E22CE] leading-none">
            सुरुचि
          </h3>
          <span className="text-[5.5px] font-semibold text-[#A855F7]">
            नवभारत रविवार
          </span>
        </div>
      </div>

      {/* Feature Cover Visual */}
      <div className="relative w-full flex-1 min-h-[44px] rounded-[3px] overflow-hidden border border-[#D8B4FE] shadow-2xs my-0.5">
        <img
          src={card1Img}
          alt="Suruchi Patrika"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0.5 right-0.5 bg-[#9333EA]/90 text-white text-[4.5px] font-bold px-1 rounded-xs">
          कवर स्टोरी
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="pt-0.5 mt-0.5 border-t border-[#9333EA]/25 flex items-center justify-between text-[5px] text-[#7E22CE] shrink-0 leading-none">
        <span className="font-bold">सुरुचि पत्रिका</span>
        <span>निःशुल्क विशेषांक</span>
      </div>
    </div>
  );
}
