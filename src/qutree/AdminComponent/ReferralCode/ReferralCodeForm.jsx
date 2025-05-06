import { useState } from "react";
import Api from "../../api";
import { message } from "antd";

const ReferralCodeForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    customCode: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await Api.post(`/referral/create`,
        null,
        { params: formData }
      );
      
      message.success("Referral code created successfully!");
      console.log(response.data);
      setFormData({ userName: "", customCode: "", discount: "", startDate: "", endDate: "" });
    } catch (error) {
     message.error("Failed to create referral code");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg mt-10 border border-[#ccc]">
      <h2 className="text-xl font-bold mb-4">Create Referral Code</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Email ID</label>
          <input
            type="text"
            name="userName"
            placeholder="example@gmail.com"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Custom Code (Optional)</label>
          <input
            type="text"
            name="customCode"
            placeholder="NEWTO500"
            value={formData.customCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Discount %</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full border-[#066882] bg-[#066882] text-white rounded-md p-2"
        >
          Create Referral Code
        </button>
      </form>
    </div>
  );
};

export default ReferralCodeForm;
