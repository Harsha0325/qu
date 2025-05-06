import { AiOutlineClose } from "react-icons/ai"; 
import { RiPhoneFill } from "react-icons/ri"; 
import { ImUserPlus } from "react-icons/im"; 
import React, { useEffect, useRef, useState } from 'react';
import {FaBuilding} from 'react-icons/fa';
import {IoArrowBackSharp} from 'react-icons/io5';
import {BsWhatsapp} from 'react-icons/bs';
import {FaPhoneAlt, FaLinkedinIn, FaFacebookF} from 'react-icons/fa';
import {MdEmail} from 'react-icons/md';
import {FaXTwitter, FaInstagram} from 'react-icons/fa6';
import {FiYoutube} from 'react-icons/fi';
import ReactCardFlip from 'react-card-flip';
import {TbListDetails} from 'react-icons/tb';
import { SiGooglemaps } from "react-icons/si";
const DigitalCard = ({
  showDetails,
  cardData,
  saveVCard,
  handleFlip,
  userDetails,
}) => {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const modalRef = useRef(null);

  // Handle clicks outside modal to close it
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowPhoneModal(false);
    }
  };

  useEffect(() => {
    if (showPhoneModal) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showPhoneModal]);
  return (
    <ReactCardFlip
      style={{width: '100%'}}
      isFlipped={showDetails}
      flipDirection="horizontal">
      <div className="flex justify-between items-center mt-4 flex-col">
      <div className="grid gap-4 bg-white/10 backdrop-blur-md shadow-lg w-[90%] sm:w-[280px] md:w-[320px] lg:w-[350px] xl:w-[350px] rounded-lg mx-auto p-5">

      {cardData.phone  && !showDetails && (
        <button
          className="flex items-center px-4 rounded-lg bg-white"
          style={{ boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)' }}
          onClick={() => setShowPhoneModal(true)}
        >
          <div
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-2xl"
            style={{ boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)' }}
          >
            <FaPhoneAlt className="text-[#063463] sm:text-base md:text-lg" />
          </div>
          <div className="ml-4 flex-grow text-center w-12 h-12 px-4 py-2">
            <span className="text-gray-800 font-bold text-lg md:text-xl">
              Phone
            </span>
          </div>
        </button>
      )}

      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 font-inter">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-6 relative w-full max-w-md ring-2 ring-gradient-to-br from-[#00CBFF] to-[#640D99]"
          >
            <button
              className="absolute top-4 left-4 text-[#063463]"
              onClick={() => setShowPhoneModal(false)}
            >   <AiOutlineClose size={20}/>
            </button>

            <button
              className="absolute top-2 right-2 text-[#063463]"
              onClick={() => saveVCard(cardData.phone, cardData.fullName)}
            >
              <div
                className="flex items-center bg-white rounded-full shadow px-3 py-2"
                style={{ boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)' }}
              >
                <div className="flex flex-col leading-tight text-sm text-[#063463] mr-2">
                  <span className="font-semibold">Save To</span>
                  <span className="font-semibold">Contacts</span>
                </div>
                <ImUserPlus size={18} />
              </div>
            </button>
            <div className="mt-10 mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Name
              </label>
              <div className="text-sm font-semibold text-[#063463]">
                {cardData.fullName}
              </div>
            </div>
            <hr className="my-1 border-gray-300" />
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">
              Mobile
              </label>
              <ul className="space-y-2">
                {Array.isArray(cardData.phone)
                  ? cardData.phone.map((num, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <RiPhoneFill className="text-[#063463]" />
                        <span>{num}</span>
                      </li>
                    ))
                  : (
                      <li className="flex items-center gap-2 text-gray-700">
                        <RiPhoneFill className="text-[#063463]" />
                        <span>{cardData.phone}</span>
                      </li>
                    )}
              </ul>
            </div>
          </div>
        </div>
      )}



          {cardData.email && !showDetails && (
            <a
              href={`mailto:${cardData.email[0]}`}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <MdEmail className="text-[#063463] text-lg" />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2 ">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  Email
                </span>
              </div>
            </a>
          )}

          {cardData.whatsapp && !showDetails && (
            <a
              href={`https://wa.me/${cardData.whatsapp.replace(/\D/g, '')}`}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <BsWhatsapp className="text-[#063463] text-lg" />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2 ">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  WhatsApp
                </span>
              </div>
            </a>
          )}

          {cardData.linkedin && !showDetails && (
            <a
              href={cardData.linkedin}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow "
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <FaLinkedinIn className="text-[#063463] text-lg " />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  LinkedIn
                </span>
              </div>
            </a>
          )}

          {cardData.twitter && !showDetails && (
            <a
              href={cardData.twitter}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <FaXTwitter className="text-[#063463] text-lg" />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  Twitter
                </span>
              </div>
            </a>
          )}

          {cardData.facebook && !showDetails && (
            <a
              href={cardData.facebook}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow "
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <FaFacebookF className="text-[#063463] text-lg " />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  facebook
                </span>
              </div>
            </a>
          )}

          {cardData.instagram && !showDetails && (
            <a
              href={cardData.instagram}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <FaInstagram className="text-[#063463] text-lg" />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  Instagram
                </span>
              </div>
            </a>
          )}

          {cardData.youtube && !showDetails && (
            <a
              href={cardData.youtube}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <FiYoutube className="text-[#063463] text-lg" />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  YouTube
                </span>
              </div>
            </a>
          )}

          {cardData.company && !showDetails && (
            <a
              href={cardData.company}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <FaBuilding className="text-[#063463] text-lg" />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                  Company
                </span>
              </div>
            </a>
          )}
           {cardData.googleMap && !showDetails && (
            <a
              href={cardData.googleMap}
              className="flex items-center px-4 py-0 rounded-lg bg-white"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <SiGooglemaps className="text-[#063463] text-lg" />
              </div>
              <div className="ml-4 flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="text-gray-800 font-bold text-lg md:text-xl">
                Google Map
                </span>
              </div>
            </a>
          )}

          {[...cardData.roles].includes('SECURITY') && !showDetails && (
            <div
              onClick={handleFlip}
              className="flex items-center px-4 py-0 rounded-lg bg-white hover:cursor-pointer"
              style={{
                boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
              }}>
              <div
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow"
                style={{
                  boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                }}>
                <TbListDetails className="text-[#063463] text-lg " />
              </div>
              <div className="  flex-grow text-center  w-12 h-12 px-4 py-2">
                <span className="flex whitespace-nowrap justify-center text-gray-800 font-bold text-lg md:text-xl">
                  User Details
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full sm:w-[280px] md:w-[320px] lg:w-[350px] xl:w-[350px] flex justify-center items-center flex-col">
        {showDetails && (
          <div className="bg-white p-4 rounded-lg font-inter">
            {userDetails ? (
              <div className="w-full">
                <div className="flex flex-row mb-0 w-64" onClick={handleFlip}>
                  <p className="flex items-center space-x-1">
                    <IoArrowBackSharp className="icon hover:cursor-pointer hover:bg-slate-400 rounded-lg" />
                    <span className="font-bold">Back</span>
                  </p>
                </div>
                <div
                  className="flex items-center px-3 py-0 rounded-lg bg-white my-2 "
                  style={{
                    boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                  }}>
                  <div className="font-bold text-sm"> Employee ID :</div>
                  <div className=" flex-grow text-center  w-12  px-1 py-3">
                    <span className="  text-gray-800 font-bold text-sm ">
                      {userDetails.employeeId}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center px-3 py-0 rounded-lg bg-white mb-2 "
                  style={{
                    boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                  }}>
                  <div className="font-bold text-sm"> Designation :</div>
                  <div className=" flex-grow text-center  w-12  px-1 py-3">
                    <span className="whitespace-nowrap  text-gray-800 font-bold text-sm">
                      {userDetails.designation}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center px-3 py-0 rounded-lg bg-white mb-2"
                  style={{
                    boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                  }}>
                  <div className="font-bold text-sm"> Blood Group :</div>
                  <div className=" flex-grow   w-12  px-2 py-3">
                    <span className="  text-gray-800 font-bold text-sm">
                      {userDetails.bloodGroup}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center px-3 py-0 rounded-lg bg-white mb-2 "
                  style={{
                    boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                  }}>
                  <div className="font-bold text-sm"> Address :</div>
                  <div className="flex flex-wrap flex-grow   w-12  px-2 py-3">
                    <span className="  text-gray-800 font-bold text-sm">
                      {userDetails.residenceAddress}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center px-3 py-0 rounded-lg bg-white mb-2"
                  style={{
                    boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                  }}>
                  <div className="font-bold text-sm"> Nok Contact No :</div>
                  <div className=" flex-grow text-center  w-12 h-12 px-2 py-3 2xl:py-1">
                    <span className="whitespace-nowrap  text-gray-800 font-bold text-sm">
                      {userDetails.nokContactNo}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center px-3 py-0 rounded-lg bg-white mb-2"
                  style={{
                    boxShadow: '1px 1px 4px 2px rgba(0, 0, 0, 0.25)',
                  }}>
                  <div className="font-bold text-sm"> Validity :</div>
                  <div className=" flex-grow  w-12 h-12 px-2 py-3 2xl:py-1">
                    <span className="  text-gray-800 font-bold text-sm">
                      {userDetails.validityUpTo}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        )}
      </div>
    </ReactCardFlip>
  );
};

export default DigitalCard;
