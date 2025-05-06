// import * as React from "react";

// export function FeatureSection({ title, description, alignment }) {
//   return (
//     <>
//       <div className={`mt-14 ${alignment === 'right' ? 'mr-32' : ''} text-4xl text-center max-md:mt-10 max-md:mr-2.5 max-md:max-w-full`}>
//         {title}
//       </div>
//       <div className="self-start mt-8 text-xl tracking-wide leading-8 text-teal-400 text-opacity-90 max-md:max-w-full">
//         {description}
//       </div>
//     </>
//   );
// }
import * as React from "react";

export function FeatureSection({ title, description, alignment }) {
  const marginRight = alignment === 'right' ? 'mr-32' : '';

  return (
    <>
      <div className={`mt-14 ${marginRight} text-4xl text-center max-md:mt-10 max-md:mr-2.5 max-md:max-w-full`}>
        {title}
      </div>
      <div className={`self-start mt-8 text-xl font-normal tracking-wide leading-8 text-[rgba(62,_176,_205,_0.89)] text-opacity-90 max-md:max-w-full ${marginRight}`}>
        {description}
      </div>
    </>
  );
}
