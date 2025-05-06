import * as React from "react";

function Button({ children, onClick, ariaLabel }) {
  return (
    <button 
      className="flex items-center self-center mt-8 text-xl font-semibold leading-snug text-center text-black bg-white rounded-xl border border-solid border-stone-50 min-h-[58px] shadow-[0px_5px_5px_rgba(0,0,0,0.25)]"
      onClick={onClick}
      tabIndex="0"
      aria-label={ariaLabel}
    >
      <div className="overflow-hidden gap-2.5 self-stretch py-4 pr-3.5 pl-4 my-auto rounded-sm min-w-[240px]">
        {children}
      </div>
    </button>
  );
}

export default Button;