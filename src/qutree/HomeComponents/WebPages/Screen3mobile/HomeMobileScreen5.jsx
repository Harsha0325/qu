import * as React from "react";
import HeroImage from "./HeroImage";
import img from '../../../../image/WebPageImages/QuickMobile.png'

function HomeMobileScreen5() {

  return (
    <div className="flex overflow-hidden flex-col px-3 pt-4 pb-20 mx-auto w-full  max-w-[480px]">
      <HeroImage 
        src={img}
        alt="QuickyNet background"
      />

    </div>
  );
}

export default HomeMobileScreen5;

