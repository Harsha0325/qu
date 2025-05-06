import React from "react";
import backgroundImage from "../../../image/Homev1/mobileBG.png";
import HomeMobileScreen1 from "./Screen3mobile/HomeMobileScreen1";
import HomeMobileScreen2 from "./Screen3mobile/HomeMobileScreen2";
import HomeMobileScreen3 from "./Screen3mobile/HomeMobileScreen3";
import HomeMobileScreen4 from "./Screen3mobile/HomeMobileScreen4";
import HomeMobileScreen5 from "./Screen3mobile/HomeMobileScreen5";
import HomeMobileScreen6 from "./Screen3mobile/HomeMobileScreen6";
import HomeMobileScreen7 from "./Screen3mobile/HomeMobileScreen7";
import HomeMobileScreen8 from "./Screen3mobile/HomeMobileScreen8";
import PlansComponent from "./Screen1/Plans";

const HomeMobile = () => {
  return (
   
    <div
    className="max-w-full bg-black  overflow-hidden"
     style={{ backgroundImage: `url(${backgroundImage})`}}
     >
      <div className="px-2">
        <HomeMobileScreen1 />
        <HomeMobileScreen2 />   
        <HomeMobileScreen3 />
        <HomeMobileScreen4 />
        <HomeMobileScreen5 />
        <HomeMobileScreen6 />
      </div>
        <PlansComponent showNav={false} />
        <HomeMobileScreen7 />
        <HomeMobileScreen8 /> 
    </div>
  );
};

export default HomeMobile;
