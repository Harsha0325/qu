import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import { AiOutlineCamera } from 'react-icons/ai';
import Api from "../api";
import ShareCommunityPopup from './ShareCommunityPopup';
import { notification } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';


const CommunityUpdateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { communityId } = location.state || {};

  // State variables
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [groupIcon, setGroupIcon] = useState('');
  const [accountType, setAccountType] = useState(false);  // false = "PUBLIC", true = "PRIVATE"
  const [street, setStreet] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedCommunityName, setSelectedCommunityName] = useState('');

  // Fetch community data on mount
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await Api.get(`/community/${communityId}`);
        const data = response.data;

        // Pre-fill form fields
        setCommunityName(data.communityName);
        setDescription(data.description);
        setGroupIcon(data.groupIcon);
        setAccountType(data.accountType === 'PRIVATE');
        setStreet(data.address.street);
        setPinCode(data.address.pinCode);
        setCountry({ label: data.address.country, value: data.address.country });
        setState({ label: data.address.state, value: data.address.state });
        setCity({ label: data.address.city, value: data.address.city });

        // Fetch countries
        GetCountries().then(countries => {
          const countryOptions = countries.map(country => ({ value: country.id, label: country.name }));
          setCountries(countryOptions);

          // Fetch states if the country is set
          if (data.address.country) {
            GetState(data.address.country).then(states => {
              const stateOptions = states.map(state => ({ value: state.id, label: state.name }));
              setStates(stateOptions);
            });
          }

          // Fetch cities if the state is set
          if (data.address.state) {
            GetCity(data.address.country, data.address.state).then(cities => {
              const cityOptions = cities.map(city => ({ value: city.id, label: city.name }));
              setCities(cityOptions);
            });
          }
        });
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  const handleCountryChange = (selectedOption) => {
    setCountry(selectedOption);
    setState(null);
    setCity(null);
    setStates([]);
    setCities([]);

    if (selectedOption) {
      GetState(selectedOption.value).then(result => {
        const stateOptions = result.map(state => ({ value: state.id, label: state.name }));
        setStates(stateOptions);
      });
    }
  };

  const handleStateChange = (selectedOption) => {
    setState(selectedOption);
    setCity(null);
    setCities([]);

    if (selectedOption) {
      GetCity(country.value, selectedOption.value).then(result => {
        const cityOptions = result.map(city => ({ value: city.id, label: city.name }));
        setCities(cityOptions);
      });
    }
  };

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption);
  };

  const handleGroupIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      communityName,
      description,
      groupIcon,
      accountType: accountType ? 'PRIVATE' : 'PUBLIC',
      address: {
        street,
        city: city?.label,
        state: state?.label,
        pinCode,
        country: country?.label
      }
    };

    try {
      const response = await Api.put(`/communities/update/${communityId}`, data);
      const { id, name } = response.data;

      if (!id) {
        throw new Error('Community ID not found in the response');
      }

      setShowPopup(true);
      setSelectedCommunity(id);
      setSelectedCommunityName(name);
    } catch (error) {
      console.error('Error updating community:', error);
      if (error.response && error.response.status === 409) {
        notification.error({
          message: 'Community Already Exists',
          description: error.response.data || 'This community name and pincode already exist. Please try to join instead.',
          placement: 'topRight',
        });
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/community");
  };

  return (
    <div className="md:ml-64 lg:ml-20">
      <div className="flex flex-col items-center mt-4 p-2">
        <form onSubmit={handleSubmit} className="max-w-xl w-full bg-white border rounded-lg p-6">
          <div className="flex justify-center text-center mb-4">
            <div className="flex items-center justify-center w-32 h-32 border border-gray-300 rounded-full bg-gray-200 relative">
              {groupIcon ? (
                <img src={groupIcon} alt="Group Icon" className="w-full h-full object-cover rounded-full" />
              ) : (
                <AiOutlineCamera className="text-gray-400 text-4xl" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleGroupIconChange}
                className="hidden"
                id="groupIconInput"
              />
              <label htmlFor="groupIconInput" className="absolute inset-0 cursor-pointer"></label>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-bold mb-1">Community Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-bold mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-bold mb-1">Make this account private? <span className="text-red-500">*</span></label>
            <FormControlLabel
              control={
                <Switch
                  checked={accountType}
                  onChange={(e) => setAccountType(e.target.checked)}
                  color="primary"
                />
              }
              label={accountType ? 'PRIVATE' : 'PUBLIC'}
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-bold mb-1">Street <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex sm:flex-row flex-col mb-5 gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-1">Country <span className="text-red-500">*</span></label>
              <Select
                options={countries}
                value={country}
                onChange={handleCountryChange}
                required
                styles={{ container: (provided) => ({ ...provided, borderRadius: '0.25rem' }) }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-1">State <span className="text-red-500">*</span></label>
              <Select
                options={states}
                value={state}
                onChange={handleStateChange}
                isDisabled={!country}
                required
                styles={{ container: (provided) => ({ ...provided, borderRadius: '0.25rem' }) }}
              />
            </div>
          </div>
          <div className="flex sm:flex-row flex-col mb-5 gap-6">
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-1">City <span className="text-red-500">*</span></label>
              <Select
                options={cities}
                value={city}
                onChange={handleCityChange}
                isDisabled={!state}
                required
                styles={{ container: (provided) => ({ ...provided, borderRadius: '0.25rem' }) }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-1">Pin Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <button type="submit" className="w-full font-bold py-3 rounded transition duration-200 bg-[#035E7B] text-white">Update Community</button>
        </form>

        {showPopup && (
          <ShareCommunityPopup
            url={`${window.location.origin}/login?communityId=${selectedCommunity}`}
            communityName={selectedCommunityName}
            onClose={closePopup}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityUpdateForm;
