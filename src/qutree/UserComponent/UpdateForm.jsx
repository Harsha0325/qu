import { AiOutlineMinusCircle } from 'react-icons/ai';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Radio } from 'antd';
import { MuiTelInput } from 'mui-tel-input';

const UpdateForm = ({
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
}) => {
  
  // Validate phone number (must be more than just country code and at least 10 digits)
  const isValidPhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/\+/g, '');
    // Check if phone is just "+91" or too short (less than 12 characters, e.g., +91 followed by 10 digits)
    return cleanPhone !== '91' && cleanPhone.length >= 12; // +91xxxxxxxxxx (12 chars minimum)
  };

  // Modified addEmail to limit to 4 emails
  const handleAddEmail = (e) => {
    e.preventDefault();
    if (formData.email.length < 4) {
      addEmail();
    }
  };

  // Modified addPhone to validate phone number
  const handleAddPhone = (e) => {
    e.preventDefault();
    const lastPhone = formData.phone[formData.phone.length - 1];
    if (formData.phone.length < 4 && (!lastPhone || isValidPhoneNumber(lastPhone))) {
      addPhone();
    }
  };

  // Modified removeEmail to prevent form submission
  const handleRemoveEmail = (index) => (e) => {
    e.preventDefault();
    removeEmail(index);
  };

  // Modified removePhone to prevent form submission
  const handleRemovePhone = (index) => (e) => {
    e.preventDefault();
    removePhone(index);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full lg:w-[300px] xl:w-[400px]"
    >
      {activeSection === 'myDetails' && (
        <div>
          <label htmlFor="fullName" className="block mt-1 text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label className="block mt-1 text-sm font-medium">Email</label>
          {(formData?.email?.length > 0 ? formData.email : ['']).map(
            (email, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
                />
                {formData.email?.length > 1 && (
                  <button
                    type="button"
                    onClick={handleRemoveEmail(index)}
                    className="p-2 text-red-500"
                  >
                    <AiOutlineMinusCircle size={20} />
                  </button>
                )}
                {index === formData.email.length - 1 && formData.email.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="text-blue-500"
                  >
                    <AiOutlinePlusCircle size={20} />
                  </button>
                )}
              </div>
            ),
          )}

          <label className="block mt-4 text-sm font-medium">Phone Number</label>
          {(formData?.phone?.length > 0 ? formData.phone : ['']).map(
            (phone, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <MuiTelInput
                  defaultCountry="IN"
                  value={phone}
                  onChange={(value) => handlePhoneChange(index, value)}
                  size="small"
                  placeholder="Phone Number"
                  className="w-full p-1 border rounded-md text-sm font-medium"
                />
                {formData.phone?.length > 1 && (
                  <button
                    type="button"
                    onClick={handleRemovePhone(index)}
                    className="p-1 text-red-500"
                  >
                    <AiOutlineMinusCircle size={20} />
                  </button>
                )}
                {index === formData.phone.length - 1 && formData.phone.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="text-blue-500"
                  >
                    <AiOutlinePlusCircle size={20} />
                  </button>
                )}
              </div>
            ),
          )}

          <label htmlFor="jobTitle" className="block mt-1 text-sm font-medium">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle || ''}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label htmlFor="location" className="block mt-1 text-sm font-medium">
            Address
          </label>
          <textarea
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
            rows={2}
          />

          <label htmlFor="location" className="block mt-1 text-sm font-medium">
            Profile Picture
          </label>
          <div
            className="border-2 border-dashed p-4 rounded-md text-center cursor-pointer mb-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {formData.image ? (
              <div className="relative inline-block">
                <img src={formData.image} alt="Profile" className="w-20 h-20" />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 shadow-md"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-gray-500">
                  Drag & drop an image here or{' '}
                  <span className="text-blue-500 underline">browse</span>
                </p>
              </label>
            )}
          </div>

          <div className="font-bold mt-2">Select Card Background</div>
          <Radio.Group
            name="backgroundIndex"
            onChange={handleBackgroundChange}
            value={backgroundIndex}
            className="flex flex-wrap justify-center gap-4 m-2"
          >
            {cardBackgroundImages.map((cardImage, index) => (
              <Radio key={index} value={index} className="relative cursor-pointer">
                <div className="relative w-28 h-22">
                  <img
                    src={backgroundImages[index]}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 flex justify-center items-center">
                    <img
                      src={cardImage}
                      alt={`Card Background ${index + 1}`}
                      className="w-12 h-16 object-contain"
                    />
                  </div>
                </div>
              </Radio>
            ))}
          </Radio.Group>

          <div className="flex flex-wrap w-[200px] gap-2 mt-2">
            <button
              className="flex-1 min-w-[40px] p-1 border border-[#066882] bg-[#066882] text-white rounded-md"
              onClick={() => handleSectionChange('companyDetails')}
            >
              Next
            </button>

            <button
              className="flex-1 min-w-[40px] p-1 border border-[#066882] bg-[#066882] text-white rounded-md"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeSection === 'companyDetails' && (
        <div>
          <label
            htmlFor="companyName"
            className="block mt-1 text-sm font-medium"
          >
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label
            htmlFor="companyLogo"
            className="block mt-1 text-sm font-medium"
          >
            Company Logo
          </label>
          <div
            className="border-2 border-dashed p-4 rounded-md text-center cursor-pointer mb-2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {formData.companyLogo ? (
              <div className="relative inline-block">
                <img
                  src={formData.companyLogo}
                  alt="Profile"
                  className="w-20 h-20"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, companyLogo: '' }))
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 shadow-md"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <input
                  type="file"
                  name="companyLogo"
                  accept="image/*"
                  onChange={handleCompanyLogaChange}
                  className="hidden"
                />
                <p className="text-gray-500">
                  Drag & drop an logo here or{' '}
                  <span className="text-blue-500 underline">browse</span>
                </p>
              </label>
            )}
          </div>

          <div className="flex flex-wrap w-[200px] gap-2 mt-2">
            <button
              className="flex-1 min-w-[40px] p-1 border border-[#066882] bg-[#066882] text-white rounded-md"
              onClick={() => handleSectionChange('socialLinks')}
            >
              Next
            </button>

            <button
              className="flex-1 min-w-[40px] p-1 border border-[#066882] bg-[#066882] text-white rounded-md"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeSection === 'socialLinks' && (
        <div>
          <label htmlFor="whatsapp" className="block mt-1 text-sm font-medium">
            Whatsapp
          </label>
          <MuiTelInput
            defaultCountry="IN"
            value={formData.whatsapp || ''}
            onChange={(value) => handleWhatsappChange(value)}
            size="small"
            placeholder="Whatsapp Number"
            className="w-full p-1 border rounded-md text-sm font-medium"
          />

          <label htmlFor="linkedin" className="block mt-1 text-sm font-medium">
            Linkedin
          </label>
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            placeholder="LinkedIn"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label htmlFor="company" className="block mt-1 text-sm font-medium">
            Company URL
          </label>
          <input
            type="text"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
            placeholder="Company URL"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label htmlFor="instagram" className="block mt-1 text-sm font-medium">
            Instagram
          </label>
          <input
            type="text"
            name="instagram"
            value={formData.instagram || ''}
            onChange={handleChange}
            placeholder="instagram"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label htmlFor="facebook" className="block mt-1 text-sm font-medium">
            Facebook
          </label>
          <input
            type="text"
            name="facebook"
            value={formData.facebook || ''}
            onChange={handleChange}
            placeholder="facebook"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label htmlFor="twitter" className="block mt-1 text-sm font-medium">
            Twitter
          </label>
          <input
            type="text"
            name="twitter"
            value={formData.twitter || ''}
            onChange={handleChange}
            placeholder="twitter"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <label htmlFor="youtube" className="block mt-1 text-sm font-medium">
            Youtube
          </label>
          <input
            type="text"
            name="youtube"
            value={formData.youtube || ''}
            onChange={handleChange}
            placeholder="youtube"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />
          <label htmlFor="googleMap" className="block mt-1 text-sm font-medium">
            Google Map
          </label>
          <input
            type="text"
            name="googleMap"
            value={formData.googleMap || ''}
            onChange={handleChange}
            placeholder="googleMap"
            className="w-full p-2 border rounded-md mb-2 text-sm font-medium"
          />

          <button
            type="submit"
            className="w-full border-[#066882] bg-[#066882] text-white rounded-md p-2 mb-2 mt-2"
          >
            Update
          </button>
        </div>
      )}
    </form>
  );
};

export default UpdateForm;