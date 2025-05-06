import * as React from "react";
import FeatureHero from "../Screen2/FeatureHero";
import ProfileCard from "../Screen2/ProfileCard";
import VisitorSection from "../Screen2/VisitorSection";
import CommunitySection from "../Screen2/CommunitySection";
import StudentCatalog from "../Screen2/StudentCatalog";
import profileimg from "../../../../image/WebPageImages/profile.svg";
import { IoCall } from "react-icons/io5";
import { MdMail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";

export default function HomeMobileScreen6() {
  // const socialIcons = [soc1, soc2, soc3, soc4, soc5];
  const socialIcons = [
    <IoCall />,
    <MdMail />,
    <FaLinkedin />,
    <FaXTwitter />,
    <FaWhatsapp />,
  ];

  const handleCreateResume = React.useCallback(() => {}, []);

  return (
    <div className="relative overflow-hidden">
      
      <div className="relative flex flex-col items-center px-1 pt-6 pb-6">
        <FeatureHero />

        <div className="mt-6 w-full ">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col  max-md:ml-0 max-md:w-full">
              <StudentCatalog />
            </div>
            <div className="flex flex-col ml-5 md:ml-0 md:w-[42%] md:h-72 w-[38%] max-md:ml-0 max-md:w-full">
              <ProfileCard
                name="Samantha Richard"
                imageUrl={profileimg}
                socialIcons={socialIcons}
                onCreateResume={handleCreateResume}
              />
            </div>
          </div>
        </div>
        <VisitorSection />
        <CommunitySection socialIcons={socialIcons} />
      </div>
    </div>
  );
}
