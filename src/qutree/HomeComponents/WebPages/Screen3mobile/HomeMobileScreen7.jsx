import React, { useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { TiBusinessCard } from "react-icons/ti";
import { FaShareAlt, FaRegIdBadge } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { IoQrCode, IoSchool } from "react-icons/io5";
import { MdOutlineShoppingCartCheckout,  MdAccessAlarm, MdOutlineCancel  } from "react-icons/md";
import { useMediaQuery, useTheme} from "@mui/material";

const HomeMobileScreen7 = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const faqs = [
    {
      question: "What is a digital business card?",
      image: <TiBusinessCard />,
      description:
        "A digital business card is an eco-friendly, customizable card that allows you to share your contact details, links, and multimedia instantly.",
    },
    {
      question: "Who can use this platform?",
      image: <FaRegIdBadge />,
      description:
        "Our platform is designed for students, professionals, and businesses looking to network, showcase their identity, and connect effectively.",
    },
    {
      question: "How does the NFC feature work?",
      image: <FaShareAlt />,
      description:
        "With NFC technology, you can share your digital card by simply tapping it on compatible devices.",
    },
    {
      question: "Is the platform suitable for students?",
      image: <IoSchool />,
      description:
        "Yes! We offer special features like student catalogs, professional communities, and affordable pricing designed specifically for students.",
    },
    {
      question: "Can I customize my digital business card?",
      image: <RxUpdate />,
      description:
        "Absolutely! You can personalize your card with designs, colors, and links to reflect your unique identity.",
    },
    {
      question: "How do I share my digital card?",
      image: <IoQrCode />,
      description:
        "You can share your card through QR codes, NFC taps, email, or a direct link, making networking effortless.",
    },
    {
      question: "How does visitor management work?",
      image: <TbTruckDelivery />,
      description:
        "Visitor management works by logging visitor details in real-time, and providing actionable insights—all designed to streamline and organize interactions effortlessly.",
    },
    {
      question: "What benefits does the platform offer to business professionals?",
      image: <MdOutlineShoppingCartCheckout />,
      description:
        "Our platform offers curated services, exclusive networking communities, marketplace visibility, and efficient visitor management to enhance office operations.",
    },
    {
      question: "What happens after the 30-day free trial?",
      image: <MdAccessAlarm />,
      description:
        "After the 30-day free trial ends, you will need to choose a subscription plan to continue using your digital business card. If you do not subscribe, your account will be deactivated, and you will lose access to your card.",
    },
    {
      question: "Can I access the service for free after the trial period?",
      image: <MdOutlineCancel />,
      description:
        "No, the service is only free for the first 30 days. After the trial, you must choose a plan to keep using the service. If you don’t select a plan, your account will be deactivated.",
    },
  ];

  const styles = {
    container: {
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    },
    header: {
      textAlign: "center",
      marginTop: "60px",
      fontSize: "30px",
    },
    faqContainer: {
      maxWidth: "800px",
      margin: "40px auto",
      marginTop: "35px",
    },
    faqItem: {
      backgroundColor: "#333",
      borderRadius: "5px",
      marginBottom: "20px",
      overflow: "hidden",
    },
    faqHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px",
      cursor: "pointer",
    },
    faqContent: {
      backgroundColor: "#444",
      padding: "10px 15px",
      fontSize: "20px",
      fontFamily: "archivo",
    },
    faqDescription: {
      backgroundColor: "white",
      textAlign: "center",
      justifyContent: "center",
      color: "black",
      fontFamily: "archivo",
      fontSize: "14px",
      padding: "20px",
      letterSpacing: "1.0796889066696167px",
    },
    faqImage: {
      width: "24px",
      height: "24px",
    },
  };

  return (
    <div style={styles.container}
    className={`${isMobile ? 'bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]' : 'bg-transparent'}`}>
      {/* Header Section */}
      <header style={styles.header}>
        <span>Frequently Asked Questions</span>
        <p
          style={{
            color: "#aaa",
            fontSize: "21.59px",
            fontStyle: "italic",
            fontWeight: "400",
            lineHeight: "26.13px",
            letterSpacing: "1.08px",
            textAlign: "center",
            marginTop: "23px",
          }}
        >
          Stuck on something? We’re here to help with all your questions and
          answers in one place.
        </p>
      </header>

      {/* FAQ Section */}
      <section style={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <div key={index} style={styles.faqItem}>
            <div
              style={styles.faqHeader}
              onClick={() => toggleAccordion(index)}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div className="text-2xl">{faq.image}</div>
                <span>{faq.question}</span>
              </div>
              <span>{activeIndex === index ? "−" : "+"}</span>
            </div>
            {activeIndex === index && (
              <div style={styles.faqDescription}>{faq.description}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};
export default HomeMobileScreen7;
