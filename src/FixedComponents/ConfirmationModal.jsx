import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons"; // Import an icon for the modal
import { RiDeleteBin5Line } from "react-icons/ri"; // Import the delete icon

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  purpose,
}) => {
  const buttonStyle =
    purpose === "Delete"
      ? {
          backgroundColor: "#d92d20",
          color: "white",
        }
      : {};

  const iconColor = purpose === "Delete" ? "red" : "";

  const okButtonText = purpose === "Delete" ? "Delete" : "Yes";

  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onClose}
      title={title}
      icon={<ExclamationCircleOutlined />}
      okText={okButtonText}
      cancelText="Cancel"
      okButtonProps={{
        danger: purpose === "Delete",
        style: buttonStyle,
      }}
    >
      <div className="flex items-center space-x-2">
        {purpose === "Delete" && (
          <div className="bg-[#fecdca] rounded-full h-[40px] w-[40px] flex justify-center items-center">
            <div className="bg-[#fda29b] h-[30px] w-[30px] rounded-full">
              <p className={`p-1 flex justify-center items-center`}>
                <RiDeleteBin5Line
                  style={{
                    color: iconColor, // Conditional icon color
                    height: "20px",
                    width: "20px",
                  }}
                />
              </p>
            </div>
          </div>
        )}
        <div>
          <p>{content}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
