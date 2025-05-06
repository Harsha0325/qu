import React, { useEffect, useState } from "react";
import { message, Input, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import Api from "../api";
import QuikynetLogo from "../../image/QuikynetLogo.svg";
import { Base64 } from "js-base64";
import Payment from "../../Payment/Payment";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import DiscountIcon from "@mui/icons-material/Sell";
const ReferralCodeApplyForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [plan, setPlan] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const tempParams = new URLSearchParams(window.location.search);
  const planId = Base64.decode(tempParams.get("id"));
  const planCategoryName = Base64.decode(tempParams.get("categoryName"));
  const userCardId = Base64.decode(tempParams.get("userId"));

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  useEffect(() => {
    fetchPlanDetails();
  }, []);

  const fetchPlanDetails = async () => {
    if (!planId) {
      message.error("Invalid plan ID.");
      return;
    }
    try {
      setLoading(true);
      const response = await Api.get(`/plans/get-by-id/${planId}`);
      if (response.status === 200) {
        setPlan(response.data);
      } else {
        throw new Error("Failed to fetch plan details.");
      }
    } catch (err) {
      message.error("Error fetching plan details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyReferralCode = async () => {
    if (!referralCode.trim()) {
        message.warning("Please enter a referral code.");
        return;
    }

    if (!plan) {
        message.error("Plan details are missing. Please try again.");
        return;
    }

    try {
        setLoading(true);
        const response = await Api.get(
            `/referral/apply-discount?code=${referralCode}&originalPrice=${plan.discountedPrice}&userId=${userCardId}`
        );

        if (response.status === 200 && response.data.status === "VALID") {
            setDiscountApplied(true);
            setDiscountAmount(response.data.discountAmount);
            message.success("Discount/Coupon Applied");
        }else {
            message.error(response.data.message || "Invalid referral code.");
        }
    } catch (err) {
        message.error("Invalid referral code.");
    } finally {
        setLoading(false);
    }
};


  const removeReferralCode = () => {
    setDiscountApplied(false);
    setDiscountAmount(0);
    setReferralCode("");
  };

  if (showPayment) {
    if (!plan) return <p>Loading payment details...</p>;
    return (
      <Payment
        payableAmount={plan.discountedPrice - discountAmount}
        purpose={`${planCategoryName} - ${plan.name}`}
        userId={userCardId}
      />
    );
  }

  return (
    <div className="flex items-center font-inter justify-center min-h-screen p-4 bg-black bg-[radial-gradient(90.16%_143.01%_at_15.32%_21.04%,_rgba(17,_112,_137,_0.2)_0%,_rgba(167,_22,_255,_0.07)_77.08%,_rgba(7,_164,_205,_0)_100%)]">
      <div className="max-w-[500px] md:w-[400px] xl:w-[500px]">
        <div className="flex flex-col w-full bg-white/10 backdrop-blur-md shadow-lg p-10 rounded-lg">
          <section className="text-center text-white">
            <h1 className="text-3xl font-semibold">Checkout</h1>
          </section>

          {loading ? (
            <Spin />
          ) : (
            <div>
              <div className="text-white text-md"><samp className="text-[#818EA1] ">Your Plan :</samp> {plan?.name || "Basic Plan"}</div>
              <p className="text-white text-md">₹{plan?.discountedPrice}/Year</p>
              <p className="text-[#818EA1] mt-1 mb-1">Includes</p>
              <ul className="text-white list-disc ml-4 text-sm">
                {plan?.features?.map((feature) => (
                  <li key={feature.id}>{feature.description}</li>
                ))}
              </ul>

              {/* Referral Code Section */}
              <div className="mt-4">
              <TextField
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="xxxxxx1234"
                className="mb-2 p-1 bg-white rounded-md"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DiscountIcon style={{ color: "#6c757d" }} />
                    </InputAdornment>
                  ),
                }}
              />
                {!discountApplied ? (
                  <Button
                    onClick={applyReferralCode}
                    className=" bg-gradient-to-r from-[#00CBFF] to-[#640D99] disabled:opacity-50 text-white w-[20%] mt-2"
                  >
                    Apply
                  </Button>
                ) : (
                  <div className="flex justify-between items-center text-green-500 p-2 rounded">
                    <span>Discount/Coupon Applied</span>
                    <button
                      onClick={removeReferralCode}
                      className="text-red-500 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-4 text-white">
                <div className="flex justify-between mb-2">
                  <span className="text-[#818EA1]">Subtotal</span>
                  <span>₹{plan?.discountedPrice}</span>
                </div>
                <div className="flex justify-between  mb-2">
                  <span  className="text-[#818EA1]">Shipping</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between  mb-2">
                  <span  className="text-[#818EA1]">Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{(plan?.discountedPrice || 0) - discountAmount}</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={() => setShowPayment(true)}
                className="w-full mt-4 py-2 bg-gradient-to-r from-[#00CBFF] to-[#640D99] disabled:opacity-50 text-white rounded"
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
      </div>

     {!isMobile &&(  <img
        src={QuikynetLogo}
        alt="Logo"
        className={`absolute top-4 left-5 z-10 w-[240px] h-[50px] cursor-pointer `}
        onClick={() => navigate("/")}
      />)}
    </div>
  );
};

export default ReferralCodeApplyForm;
