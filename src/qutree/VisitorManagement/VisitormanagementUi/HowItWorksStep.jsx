import React from 'react';

function HowItWorksStep({ number, title, description, isLast }) {
  return (
    <div className={`flex gap-0.5 items-start w-full ${!isLast ? 'mt-3.5' : ''}`}>
      <div className="w-4 text-lg leading-snug">{number}.</div>
      <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
        <div className="w-full text-lg font-semibold leading-snug">
          {title}
        </div>
        <div className="mt-1 text-sm leading-5">
          {description}
        </div>
      </div>
    </div>
  );
}

export default HowItWorksStep;