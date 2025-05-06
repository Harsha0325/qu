import { useContext, useEffect, useState } from "react";
import { message } from "antd";
import Loading from "../../FixedComponents/Loading";
import BusinessCardPreview from "./BusinessCardPreview";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { RolesContext } from "../../context/RoleContext";
import Api from "../api";
import { useNavigate } from "react-router-dom";

import CardBackground1 from "../../image/cardBack/CardBackground1.svg";
import CardBackground2 from "../../image/cardBack/CardBackground2.svg";
import CardBackground3 from "../../image/cardBack/CardBackground3.svg";
import CardBackground4 from "../../image/cardBack/CardBackground4.svg";
import CardBackground5 from "../../image/cardBack/CardBackground5.svg";
import CardBackground6 from "../../image/cardBack/CardBackground6.svg";
import BackgroundImage1 from "../../image/cardBack/BackgroundImage1.svg";
import BackgroundImage2 from "../../image/cardBack/BackgroundImage2.svg";
import BackgroundImage3 from "../../image/cardBack/BackgroundImage3.svg";
import BackgroundImage4 from "../../image/cardBack/BackgroundImage4.svg";
import BackgroundImage5 from "../../image/cardBack/BackgroundImage5.svg";
import BackgroundImage6 from "../../image/cardBack/BackgroundImage6.svg";
import UpdateForm from './UpdateForm';

const UpdateCardForm = () => {
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("myDetails");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { userId, roles } = useContext(RolesContext);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardBackgroundImages = [
    CardBackground1,
    CardBackground2,
    CardBackground3,
    CardBackground4,
    CardBackground5,
    CardBackground6,
  ];

  const backgroundImages = [
    BackgroundImage1,
    BackgroundImage2,
    BackgroundImage3,
    BackgroundImage4,
    BackgroundImage5,
    BackgroundImage6,
  ];

  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState();

  const handleBackgroundChange = (e) => {
    const selectedIndex = parseInt(e.target.value, 10);
    setBackgroundIndex(selectedIndex);
    setSelectedBackgroundImage(backgroundImages[selectedIndex]);
    
    setFormData((prevData) => ({
      ...prevData,
      backgroundIndex: selectedIndex,
    }));
  };

  useEffect(() => {
    setSelectedBackgroundImage(backgroundImages[backgroundIndex]);
  }, [backgroundIndex]);

  const updateMedia = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    Api.get(`/get/${userId}`)
      .then((response) => {
        setFormData(response.data);
        setOriginalData(response.data);

        if (response.data.backgroundIndex !== undefined) {
          setBackgroundIndex(response.data.backgroundIndex);
          setSelectedBackgroundImage(
            backgroundImages[response.data.backgroundIndex]
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [userId]);

  // Email validation regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone validation regex (allows international formats)
  const isValidPhone = (phone) => {
    return /^\+?[\d\s-]{8,}$/.test(phone);
  };

  const trimValue = (value) => {
    return typeof value === 'string' ? value.trim() : value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: trimValue(value)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("Only image files are allowed!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevState) => ({ ...prevState, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("Only image files are allowed!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevState) => ({
          ...prevState,
          companyLogo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("Only image files are allowed!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevState) => ({ ...prevState, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate emails
    if (formData.email) {
      for (const email of formData.email) {
        if (email && !isValidEmail(email.trim())) {
          message.error("Please enter valid email addresses");
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Validate phones
    if (formData.phone) {
      for (const phone of formData.phone) {
        if (phone && !isValidPhone(phone.trim())) {
          message.error("Please enter valid phone numbers");
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Filter out empty emails and phones
    const cleanedFormData = {
      ...formData,
      email: (formData.email || []).filter((email) => email.trim() !== ''),
      phone: (formData.phone || []).filter((phone) => phone.trim() !== ''),
    };

    // Trim all string values in cleanedFormData
    const trimmedData = Object.keys(cleanedFormData).reduce((acc, key) => {
      if (Array.isArray(cleanedFormData[key])) {
        acc[key] = cleanedFormData[key].map(item => trimValue(item));
      } else {
        acc[key] = trimValue(cleanedFormData[key]);
      }
      return acc;
    }, {});

    // Only include changed fields in the update
    const updatedData = {};
    Object.keys(trimmedData).forEach((key) => {
      if (JSON.stringify(trimmedData[key]) !== JSON.stringify(originalData[key])) {
        updatedData[key] = trimmedData[key];
      }
    });

    if (Object.keys(updatedData).length > 0) {
      Api.patch(`/update/card/${userId}`, updatedData)
        .then(() => {
          message.success("User updated successfully");
          navigate(-1);
        })
        .catch(() => message.error("Failed to update user"))
        .finally(() => setIsSubmitting(false));
    } else {
      message.info("No changes detected.");
      setIsSubmitting(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...(formData.email || [])];
    updatedEmails[index] = trimValue(value);
    setFormData({ ...formData, email: updatedEmails });
  };

  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...(formData.phone || [])];
    updatedPhones[index] = trimValue(value);
    setFormData({ ...formData, phone: updatedPhones });
  };

  const addPhone = () => {
    const lastPhone = formData.phone?.[formData.phone.length - 1];
    if (!lastPhone || (lastPhone.trim() !== '' && isValidPhone(lastPhone))) {
      setFormData((prevState) => ({
        ...prevState,
        phone: [...(prevState.phone || []), ""],
      }));
    }
  };

  const addEmail = () => {
    const lastEmail = formData.email?.[formData.email.length - 1];
    if (!lastEmail || (lastEmail.trim() !== '' && isValidEmail(lastEmail))) {
      setFormData((prevState) => ({
        ...prevState,
        email: [...(prevState.email || []), ""],
      }));
    }
  };

  const removeEmail = (index) => {
    const updatedEmails = [...formData.email];
    updatedEmails.splice(index, 1);
    setFormData({ ...formData, email: updatedEmails });
  };

  const removePhone = (index) => {
    const updatedPhones = [...formData.phone];
    updatedPhones.splice(index, 1);
    setFormData({ ...formData, phone: updatedPhones });
  };

  const handleWhatsappChange = (value) => {
    setFormData({ ...formData, whatsapp: trimValue(value) });
  };

  if (loading) {
    return <Loading message="Loading" />;
  }

  return (
    <div className={`${isMobile ? "ml-0" : "ml-[250px]"} max-w-[1000px] mt-5`}>
      <div className="mb-5 flex items-center space-x-2 ml-6">
        <ArrowLeftOutlined
          className="text-2xl font-semibold text-gray-700 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-2xl font-semibold text-gray-700">Edit Card</span>
        {roles.includes("SECURITY") && (
          <button
            onClick={() => navigate("/additional-user-details")}
            className="px-3 py-2 bg-[#035E7B] text-white"
          >
            Additional User Details
          </button>
        )}
      </div>
      <div className={`flex`}>
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg border border-[#CCC] font-inter">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Edit User Details
          </h2>

          <div className="flex flex-wrap w-full">
            <button
              className={`flex-1 min-w-[120px] p-2 border border-[#066882] 
            ${
              activeSection === "myDetails"
                ? "bg-gradient-to-r from-[#066882] to-[#00CBFF] text-white"
                : "bg-white text-[#066882]"
            } 
            h-[40px]`}
              onClick={() => handleSectionChange("myDetails")}
            >
              My Details
            </button>

            <button
              className={`flex-1 min-w-[120px] p-2 border border-[#066882] 
            ${
              activeSection === "companyDetails"
                ? "bg-gradient-to-r from-[#066882] to-[#00CBFF] text-white"
                : "bg-white text-[#066882]"
            }  h-[40px]`}
              onClick={() => handleSectionChange("companyDetails")}
            >
              Company
            </button>

            <button
              className={`flex-1 min-w-[120px] p-2 border border-[#066882] 
            ${
              activeSection === "socialLinks"
                ? "bg-gradient-to-r from-[#066882] to-[#00CBFF] text-white"
                : "bg-white text-[#066882]"
            } 
           h-[40px]`}
              onClick={() => handleSectionChange("socialLinks")}
            >
              Social
            </button>
          </div>

          <UpdateForm
            {...{
              handleSubmit,
              activeSection,
              formData,
              handleChange,
              handleEmailChange,
              removeEmail,
              addEmail,
              handlePhoneChange,
              removePhone,
              addPhone,
              handleDragOver,
              handleDrop,
              setFormData,
              handleImageChange,
              handleBackgroundChange,
              backgroundIndex,
              cardBackgroundImages,
              backgroundImages,
              handleSectionChange,
              navigate,
              handleCompanyLogaChange,
              handleWhatsappChange,
              isSubmitting
            }}
          />
        </div>

        {!isMobile && (
          <div className="w-[46%] ml-4 mr-4 border border-[#ccc] p-4 rounded-lg">
            <BusinessCardPreview cardData={formData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateCardForm;