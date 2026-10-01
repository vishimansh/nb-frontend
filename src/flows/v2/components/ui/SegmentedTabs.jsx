import React from 'react';

export default function SegmentedTabs({
  tabs,
  activeTab,
  onChange,
  className = '',
}) {
  return (
    <div
      className={`p-1 rounded-2xl bg-[#F7F7F4] border border-[#E5E7EB] flex items-center select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const isDisabled = !!tab.disabled;

        return (
          <button
            key={tab.id}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-[14px] font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 text-center ${
              isDisabled
                ? 'opacity-40 cursor-not-allowed text-[#A6A4A9]'
                : isActive
                ? 'bg-white text-[#2B2437] shadow-sm font-bold'
                : 'text-[#6B7280] hover:text-[#2B2437]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && <span className="text-[11px] font-normal">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
