import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { RolesContext } from "../../context/RoleContext";
import { useMediaQuery, useTheme } from "@mui/material";
import Select from "react-select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import { AiOutlineCamera } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../api";
import ShareCommunityPopup from "./ShareCommunityPopup";
import { notification, Spin } from "antd";

const EditCommunityForm = () => {
  const { jwtToken } = useAuth() || {};
  const { userId } = React.useContext(RolesContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

  // Destructure communityId and data from location.state
  const { communityId, data } = location.state || {};

  const [formState, setFormState] = useState({
    communityName: "",
    description: "",
    groupIcon: "",
    accountType: false, // false = PUBLIC, true = PRIVATE
    street: "",
    pinCode: "",
    country: null,
    state: null,
    city: null,
    countries: [],
    states: [],
    cities: [],
    showPopup: false,
    selectedCommunity: "",
    selectedCommunityName: "",
  });
  const [loading, setLoading] = useState(false); // Loading state for API call

  // Populate form with data from location.state and fetch community address
  useEffect(() => {
    if (!communityId || !jwtToken || !data) return; // Exit if missing required data

    // Set initial form values from passed data
    setFormState((prev) => ({
      ...prev,
      communityName: data.communityName || "",
      description: data.description || "",
      groupIcon: data.groupIcon || "",
      accountType: data.accountType === "PRIVATE",
    }));

    const fetchCommunityAddress = async () => {
      setLoading(true);
      try {
        const response = await Api.get(`/communityUsers/${communityId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const communityUsersData = response.data; // Array of CommunityUsersDto

        // Use the first user's communityAddress (assuming it’s consistent across users)
        const communityAddress = communityUsersData[0]?.communityAddress || {};

        // Update form with address data
        setFormState((prev) => ({
          ...prev,
          street: communityAddress.street || "",
          pinCode: communityAddress.pinCode || "",
        }));

        // Load countries and pre-select country/state/city
        GetCountries().then((countriesData) => {
          const countries = countriesData.map((c) => ({
            value: c.id,
            label: c.name,
          }));
          setFormState((prev) => ({ ...prev, countries }));

          if (communityAddress.country) {
            const selectedCountry = countries.find(
              (c) => c.label === communityAddress.country
            );
            if (selectedCountry) {
              setFormState((prev) => ({ ...prev, country: selectedCountry }));
              GetState(selectedCountry.value).then((statesData) => {
                const states = statesData.map((s) => ({
                  value: s.id,
                  label: s.name,
                }));
                setFormState((prev) => ({ ...prev, states }));

                if (communityAddress.state) {
                  const selectedState = states.find(
                    (s) => s.label === communityAddress.state
                  );
                  if (selectedState) {
                    setFormState((prev) => ({ ...prev, state: selectedState }));
                    GetCity(selectedCountry.value, selectedState.value).then(
                      (citiesData) => {
                        const cities = citiesData.map((c) => ({
                          value: c.id,
                          label: c.name,
                        }));
                        setFormState((prev) => ({ ...prev, cities }));

                        if (communityAddress.city) {
                          const selectedCity = cities.find(
                            (c) => c.label === communityAddress.city
                          );
                          if (selectedCity) {
                            setFormState((prev) => ({
                              ...prev,
                              city: selectedCity,
                            }));
                          }
                        }
                      }
                    );
                  }
                }
              });
            }
          }
        });
      } catch (error) {
        api.error({
          message: "Failed to Fetch Community Address",
          description:
            error.response?.data ||
            "Could not load address data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityAddress();
  }, [communityId, jwtToken, api, data]);

  const handleSelectChange = (type, value) => {
    setFormState((prev) => ({
      ...prev,
      [type]: value,
      ...(type === "country"
        ? { state: null, city: null, states: [], cities: [] }
        : {}),
      ...(type === "state" ? { city: null, cities: [] } : {}),
    }));

    if (type === "country" && value) {
      GetState(value.value).then((data) =>
        setFormState((prev) => ({
          ...prev,
          states: data.map((s) => ({ value: s.id, label: s.name })),
        }))
      );
    }
    if (type === "state" && value) {
      GetCity(formState.country.value, value.value).then((data) =>
        setFormState((prev) => ({
          ...prev,
          cities: data.map((c) => ({ value: c.id, label: c.name })),
        }))
      );
    }
  };

  const handleGroupIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, groupIcon: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      communityName,
      description,
      groupIcon,
      accountType,
      street,
      pinCode,
      country,
      state,
      city,
    } = formState;

    if (!groupIcon) {
      api.error({
        message: "Image Required",
        description: "Please upload a group icon image.",
      });
      return;
    }

    const payload = {
      communityName,
      description,
      groupIcon,
      accountType: accountType ? "PRIVATE" : "PUBLIC",
      address: {
        street,
        city: city?.label || "",
        state: state?.label || "",
        pinCode,
        country: country?.label || "",
      },
    };

    try {
      const response = await Api.put(
        `/communities/update/${communityId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        api.success({
          message: "Community Updated",
          description: "The community has been updated successfully.",
        });
        setFormState((prev) => ({
          ...prev,
          showPopup: true,
          selectedCommunity: communityId,
          selectedCommunityName: communityName,
        }));
        setTimeout(() => navigate("/community"), 2000); // Delay navigation to show popup
      }
    } catch (error) {
      api.error({
        message: "Update Failed",
        description:
          error.response?.data ||
          "Something went wrong, please try again later.",
      });
    }
  };

  const closePopup = () => {
    setFormState((prev) => ({
      ...prev,
      showPopup: false,
      selectedCommunity: "",
      selectedCommunityName: "",
    }));
    navigate("/community");
  };

  const {
    communityName,
    description,
    groupIcon,
    accountType,
    street,
    pinCode,
    country,
    state,
    city,
    countries,
    states,
    cities,
    showPopup,
    selectedCommunity,
    selectedCommunityName,
  } = formState;

  // Display an error if no communityId or data is received
  if (!communityId || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Error: No community ID or data provided. Please go back and try again.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center ${
        isMobile ? "p-4" : "p-10"
      }`}
    >
      {contextHolder}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin tip="Loading community data..." />
        </div>
      ) : (
        <form
          className="bg-white shadow-md p-6 rounded-lg w-full max-w-xl"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Edit Community
          </h2>

          <div className="flex justify-center mb-4">
            <div className="relative border-2 border-gray-300 bg-gray-100 rounded-full w-24 h-24 overflow-hidden">
              {groupIcon ? (
                <img
                  src={groupIcon}
                  alt="Group Icon"
                  className="w-full h-full object-cover"
                />
              ) : (
                <AiOutlineCamera className="absolute inset-0 m-auto text-4xl text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleGroupIconChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 text-sm">
              Community Name
            </label>
            <input
              type="text"
              value={communityName}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  communityName: e.target.value,
                }))
              }
              className="block shadow-sm mt-1 px-3 py-2 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 text-sm">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="block shadow-sm mt-1 px-3 py-2 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <FormControlLabel
              control={
                <Switch
                  checked={accountType}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      accountType: e.target.checked,
                    }))
                  }
                  color="primary"
                />
              }
              label={accountType ? "PRIVATE" : "PUBLIC"}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 text-sm">
              Street
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, street: e.target.value }))
              }
              className="block shadow-sm mt-1 px-3 py-2 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full sm:text-sm"
              required
            />
          </div>

          <div className="gap-4 grid grid-cols-2 mb-4">
            <Select
              options={countries}
              value={country}
              onChange={(value) => handleSelectChange("country", value)}
              placeholder="Country"
              className="text-sm"
            />
            <Select
              options={states}
              value={state}
              onChange={(value) => handleSelectChange("state", value)}
              isDisabled={!country}
              placeholder="State"
              className="text-sm"
            />
          </div>

          <div className="gap-4 grid grid-cols-2 mb-4">
            <Select
              options={cities}
              value={city}
              onChange={(value) => handleSelectChange("city", value)}
              isDisabled={!state}
              placeholder="City"
              className="text-sm"
            />
            <input
              type="text"
              value={pinCode}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, pinCode: e.target.value }))
              }
              placeholder="Pin Code"
              className="block shadow-sm px-3 py-2 border focus:border-blue-500 rounded-md focus:ring-blue-500 w-full sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded-md focus:ring focus:ring-blue-200 w-full text-white focus:outline-none"
          >
            Save Changes
          </button>
        </form>
      )}

      {showPopup && (
        <ShareCommunityPopup
          url={`${window.location.origin}/login?communityId=${selectedCommunity}`}
          communityName={selectedCommunityName}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default EditCommunityForm;
