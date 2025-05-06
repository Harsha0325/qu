import CustomButton from "../../utils/Button";
import { Share, DeleteForever, BorderColor, PushPinOutlined } from '@mui/icons-material';
import { IoIosPeople } from "react-icons/io";
import { IoIosChatboxes } from "react-icons/io";
import { FaGlobeAmericas } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";

const CardLayout = ({ children, pinIndex, setPinIndex, community, index, height }) => (
    <div className={`flex flex-col border border-[#E5E7EB] bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200
        min-w-[300px] max-w-[300px] h-fit m-3 overflow-hidden p-4`}>
        <div className="relative w-full h-[200px] overflow-hidden rounded-lg"
            onClick={() => setPinIndex(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])}>
            <PushPinOutlined
                className={`absolute top-2 right-2 p-1 border rounded-full rotate-45 z-[1]
                ${pinIndex.includes(index) ? "bg-primary text-white" : "bg-white text-primary"}`}
            />
            <img className="w-full h-full object-cover"
                src={community.groupIcon}
                alt={community.communityName}
            />
        </div>
        {children}
    </div>
);

export const MyCommunityCard = (props) => {
    const { index, community, mycommunityPinindex, setMycommunityPinindex, handleShare, showDeleteModal, handleViewMembers } = props;

    return (
        <CardLayout pinIndex={mycommunityPinindex} setPinIndex={setMycommunityPinindex} community={community} index={index}>
            <div className="flex flex-col justify-between p-4">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-3">{community.communityName}</h3>
                    <div className="flex justify-between text-gray-500 text-sm pb-2 border-b">
                        <span className="flex items-center gap-1">
                            <FaGlobeAmericas className="mr-1" />
                            {community.accountType} Group
                        </span>
                        <span className="flex items-center gap-1">
                            {/* <img src="/images/community.png" alt="Members" className="w-4 h-4" /> */}
                            <IoIosPeople className="text-gray-600 text-xl mr-1" />
                            {community.memberCount} members
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-3">
                        <Share className="text-gray-500 cursor-pointer hover:text-primary" onClick={() => handleShare(community.id, community.communityName)} />
                        <DeleteForever className="text-red-500 cursor-pointer hover:text-red-600" onClick={() => showDeleteModal(community.id, community.communityName)} />
                        <BorderColor className="text-gray-500 cursor-pointer hover:text-primary" />
                    </div>
                    <CustomButton
                        onClick={() => handleViewMembers(community.id)}
                        content="View"
                        className="px-4 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    />
                </div>
            </div>
        </CardLayout>
    );
};

export const MyCommunityCardWithChat = (props) => {
    const navigate = useNavigate();

    const { index, community, mycommunityPinindex, setMycommunityPinindex, handleShare, showDeleteModal, showEditModal, handleViewMembers } = props;

    return (
        <CardLayout className="border-4 border-[#066882]" pinIndex={mycommunityPinindex} setPinIndex={setMycommunityPinindex} community={community} index={index}>
            <div className="flex flex-col p-4">
                <div className="flex justify-between border-b">
                    <div className="flex flex-col w-[80%]">
                        <h3 className="font-semibold text-lg text-gray-800">{community.communityName}</h3>
                        <div className="flex items-center text-gray-500 text-sm pb-2">
                            <FaGlobeAmericas className="mr-1" />
                            <span>{community.accountType.charAt(0).toUpperCase() + community.accountType.slice(1).toLowerCase()}</span>
                            {/* <img src="/images/community.png" alt="Members" className="w-4 h-4 ml-2 mr-1" /> */}
                            <IoIosPeople className="text-gray-600 text-xl ml-4 mr-1" />
                            <span>{community.memberCount} members</span>
                        </div>
                    </div>
                    <div onClick={() => navigate(`/community/${community.id}/chat`)} className="cursor-pointer">
                        <IoIosChatboxes className="w-[38px] h-[38px] text-white bg-[#066882] hover:bg-blue-500 rounded-full p-2"/>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3 mb-1">
                    <div className="flex gap-3">
                        <Share className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleShare(community.id, community.communityName)} />
                        {community.role === "ADMIN" ?
                        <>
                            <RiDeleteBin6Line className="text-[#B32318] cursor-pointer text-2xl hover:text-red-600" onClick={() => showDeleteModal(community.id, community.communityName)} />
                            <BorderColor className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => showEditModal(community.id, community.communityName, community)} />
                        </>
                        : "" }
                    </div>
                    <CustomButton
                        onClick={() => handleViewMembers(community.id)}
                        content="View"
                        className="px-4 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    />
                </div>
            </div>
        </CardLayout>
    );
};

export const ExploreCommunityCard = ({ index, community: c, explorecommunityPinindex, setExplorecommunityPinindex, handleJoinClick, handleRequestJoinClick, isRequested }) => (
    <CardLayout pinIndex={explorecommunityPinindex} setPinIndex={setExplorecommunityPinindex} community={c} index={index}>
        <div className="flex flex-col justify-between p-4">
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-3">{c.communityName}</h3>
                <div className="flex justify-between text-gray-500 text-sm pb-2 border-b">
                    <span className="flex items-center gap-1">
                        <FaGlobeAmericas className="mr-1" />
                        {c.accountType.charAt(0).toUpperCase() + c.accountType.slice(1).toLowerCase()}
                    </span>
                    <span className="flex items-center gap-1">
                        {/* <img src="/images/community.png" alt="Members" className="w-4 h-4" /> */}
                        <IoIosPeople className="text-gray-600 text-xl" />
                        {c.memberCount} members
                    </span>
                </div>
            </div>
            <div className="flex justify-start mt-3 mb-1">
                <CustomButton
                    onClick={() => c.accountType === "PUBLIC" ? handleJoinClick(c.id) : handleRequestJoinClick(c.id)}
                    content={isRequested ? "Request Sent" : (c.accountType === "PUBLIC" ? "Join Community" : "Request to Join")}
                    className={`px-4 py-1.5 text-sm bg-primary rounded-md hover:bg-primary/90 ${isRequested ? "bg-white border-[#066882] border-2" : ""}`}
                    style={{color: isRequested ? "#066882" : "white"}}
                    disabled={isRequested}
                />
            </div>
        </div>
    </CardLayout>
);

export const Tab = ({ label, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`
            px-4 py-2 text-sm cursor-pointer transition-colors
            ${isActive
                ? "border-b-2 border-[#066882] text-[#066882] font-medium"
                : "text-gray-600 hover:text-gray-800"
            }
        `}
    >
        {label}
    </div>
);

export const SubTab = ({ label, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`
            px-4 py-2 m-1 text-sm border rounded-lg cursor-pointer transition-all
            ${isActive
                ? "bg-[#066882] text-white font-medium shadow-sm"
                : "bg-[#d4f6ff] text-[#066882] font-bold border-0 hover:bg-gray-50 hover:border-gray-300"
            }
        `}
    >
        {label}
    </div>
);
