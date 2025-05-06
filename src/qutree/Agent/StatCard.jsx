import React from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, icon, percentage, trend, trendIcon, isGradient, onIconClick }) {
  const cardBaseClasses =
    "flex overflow-hidden flex-col flex-1 shrink p-5 rounded-3xl border border-gray-200 border-solid shadow-lg basis-0 min-w-[240px]";
  const cardClasses = isGradient
    ? `${cardBaseClasses} bg-[linear-gradient(127deg,#066882_16.87%,#00CBFF_85.56%)]`
    : `${cardBaseClasses} bg-white`;

  const titleClasses = isGradient
    ? "text-base font-medium tracking-normal text-white"
    : "text-base font-medium tracking-normal text-gray-900";

  const valueClasses = isGradient
    ? "mt-2 text-3xl font-semibold tracking-wide text-white"
    : "mt-2 text-3xl font-semibold tracking-wide text-neutral-800";

  const iconContainerClasses = isGradient
    ? "flex overflow-hidden gap-2 justify-center items-center px-2 w-9 h-9 bg-white rounded-lg min-h-[36px] cursor-pointer"
    : "flex overflow-hidden gap-2 justify-center items-center px-2 w-9 h-9 rounded-lg bg-cyan-100 bg-opacity-60 min-h-[36px] cursor-pointer";

  return (
    <div className={cardClasses}>
      <div className="flex gap-4 items-start w-full">
        <div className="flex flex-col flex-1 shrink basis-4 min-w-[240px]">
          <div className={titleClasses}>{title}</div>
          <div className={valueClasses}>{value}</div>
        </div>
        <div className={iconContainerClasses} onClick={onIconClick}>
          <img
            loading="lazy"
            src={icon}
            alt=""
            className="object-contain self-stretch my-auto w-5 aspect-square"
          />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
