
import * as React from "react";

function HeroImage({ src, alt }) {
  return (
    <div className="relative flex flex-col mb-4">
      <div className="text-2xl font-bold tracking-wider text-white text-center py-4">
        Why Choose QuikyNet?
      </div>
      <div className="relative aspect-[0.393]">
        <img
          loading="lazy"
          src={src}
          alt={alt}
          className="object-cover absolute inset-0 size-full"
        />
      </div>
    </div>
  );
}

export default HeroImage;