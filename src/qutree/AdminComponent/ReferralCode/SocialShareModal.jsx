import React from "react";
import { IoClose } from "react-icons/io5";
import { FaTwitter, FaCopy } from "react-icons/fa";
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { message } from "antd";

const SocialShareModal = ({ isOpen, onClose, referralCode }) => {
  
  if (!isOpen) return null;

  const referralLink = `${window.location.origin}/referral/${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    message.success("Referral link copied to clipboard!");
  };

  const shareOnWhatsApp = () => {
    const msg = `Join now using my referral code: ${referralCode}! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const shareOnTwitter = () => {
    const tweet = `🔥 Check out this amazing referral code: ${referralCode}! ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
  };

  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(referralLink)}&title=Referral Code&summary=Join now using my referral code: ${referralCode}`, "_blank");
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded w-80 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <IoClose
          className="absolute top-2 right-2 text-2xl cursor-pointer"
          onClick={onClose}
        />
        <h2 className="text-lg font-semibold mb-4">Share Referral Code</h2>

        <div className="flex flex-row gap-3 border border-[#ccc] p-4 rounded">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-white px-2 py-2 rounded text-2xl bg-[#242C30]"
          >
            <FaCopy />
          </button>

          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-2 text-white px-2 py-2 rounded text-2xl bg-[#25D366]"
          >
            <FaWhatsapp />
          </button>

          <button
            onClick={shareOnTwitter}
            className="flex items-center gap-2 text-white px-2 py-2 rounded text-2xl bg-[#1DA1F2]" 
          >
            <FaTwitter />
          </button>

          <button
            onClick={shareOnLinkedin}
            className="flex items-center gap-2 text-white px-2 py-2 rounded text-2xl bg-[#0A66C2]" 
          >
            <FaLinkedin />
          </button>

          <button
            onClick={shareOnFacebook}
            className="flex items-center gap-2 text-white px-2 py-2 rounded text-2xl bg-[#1877F2]"
          >
            <FaFacebook />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;
