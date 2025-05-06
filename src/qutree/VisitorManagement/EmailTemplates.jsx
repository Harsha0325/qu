import React, { useState, useEffect } from "react";
import Api from "../BaseUrlAPI";
import { useAuth } from "../../context/AuthContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    templateName: "",
    subject: "",
    body: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { jwtToken } = useAuth() || {};
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    if (jwtToken) {
      Api.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${jwtToken}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  }, [jwtToken]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/get-email-templates");
      setTemplates(response.data);
    } catch (err) {
      setError("Error fetching templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await Api.put(`/update-email-template-by-id/${editId}`, formData);
      } else {
        await Api.post("/create-email-template", formData);
      }
      setFormData({ templateName: "", subject: "", body: "" }); // Clear form data
      setEditId(null); // Reset editId to switch back to "Create New Template"
      fetchTemplates();
    } catch (err) {
      setError("Error creating or updating the template.");
    } finally {
      setLoading(false);
    }
  };

  //   const handleDelete = async (id) => {
  //     if (window.confirm("Are you sure you want to delete this template?")) {
  //       setLoading(true);
  //       try {
  //         await Api.delete(`/delete-email-template-by-id/${id}`);
  //         fetchTemplates();
  //       } catch (err) {
  //         setError("Error deleting the template.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };
  const handleDelete = async () => {
    setLoading(true);
    try {
      await Api.delete(`/delete-email-template-by-id/${deleteId}`);
      fetchTemplates();
      setDeleteModalOpen(false);
    } catch (err) {
      setError("Error deleting the template.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleEdit = (template) => {
    setFormData({
      templateName: template.templateName,
      subject: template.subject,
      body: template.body,
    });
    setEditId(template.id);
  };

  const handleCancelEdit = () => {
    // Clear form and reset editId to null
    setFormData({ templateName: "", subject: "", body: "" });
    setEditId(null);
  };

  return (
    <div style={{ display: "flex", padding: "20px", marginLeft: "250px" }}>
      {/* Left Section - Templates Table */}
      <div style={{ flex: "1", marginRight: "20px" }}>
        <h2>Existing Templates</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#ffffff",
                  borderBottom: "2px solid #ccc",
                }}
              >
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  Name
                </th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  Subject
                </th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <td style={{ padding: "10px" }}>{template.templateName}</td>
                  <td style={{ padding: "10px" }}>{template.subject}</td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => handleEdit(template)}
                      style={{
                        marginRight: "5px",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      <FaEdit
                        style={{
                          fontSize: "24px",
                          color: "#035E7B",
                        }}
                      />
                    </button>
                    <button
                      onClick={() => openDeleteModal(template.id)}
                      style={{
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "#FBE7E7",
                        borderRadius: "4px",
                      }}
                    >
                      <RiDeleteBin6Line
                        style={{
                          fontSize: "24px",
                          color: "red",
                          backgroundColor: "#FBE7E7",
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Right Section - Form */}
      <div
        style={{
          flex: "1",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <h2>{editId ? "Update Template" : "Create New Template"}</h2>

        {/* Instructions Section */}
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Instructions</h3>
          <p style={{ margin: "0", color: "#555", fontSize: "14px" }}>
            Use the following placeholders in your template body:
          </p>
          <ul
            style={{ margin: "10px 0 0 20px", color: "#555", fontSize: "14px" }}
          >
            <li>
              <strong>{`{{userName}}`}</strong>: The name of the user.
            </li>
            <li>
              <strong>{`{{companyName}}`}</strong>: The name of the company.
            </li>
            <li>
              <strong>{`{{appointmentDate}}`}</strong>: The date of the
              appointment.
            </li>
            <li>
              <strong>{`{{companyWebsite}}`}</strong>: The company's website
              URL.
            </li>
          </ul>

          <p style={{ margin: "10px 0 0 0", color: "#555", fontSize: "14px" }}>
            Example Template:
          </p>
          <pre
            style={{
              backgroundColor: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              fontSize: "14px",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              marginTop: "5px",
            }}
          >
            {`Dear {{userName}},\n\nYour appointment request with {{companyName}} has been received.\n\nThe appointment is scheduled for: {{appointmentDate}}.\n\nWe will notify you once your appointment has been accepted.\n\nThank you!\n\nVisit our Website: {{companyWebsite}}`}
          </pre>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Template Name
            </label>
            <input
              type="text"
              name="templateName"
              value={formData.templateName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Body
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minHeight: "150px",
              }}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#035E7B",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {editId ? "Update Template" : "Create Template"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#D41111",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <>
          {/* Blur and darken the background */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999, // Ensure it's behind the modal
              backdropFilter: "blur(4px)", // Add blur effect
            }}
            onClick={closeDeleteModal} // Close the modal if the background is clicked
          ></div>

          {/* Modal Content */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "20px",
              zIndex: 1000,
              maxWidth: "400px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <RiDeleteBin6Line
                style={{
                  fontSize: "24px",
                  color: "red",
                  padding: "8px",
                  backgroundColor: "#FBE7E7",
                  borderRadius: "50%",
                }}
              />
            </div>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.125rem",
                color: "#242C30",
                fontFamily: "Inter",
              }}
            >
              Delete Email Template?
            </span>
            <div
              style={{
                fontFamily: "Inter",
                marginBottom: "5px",
                marginTop: "8px",
              }}
            >
              Are you sure you want to delete this template?
            </div>
            <div style={{ fontFamily: "Inter", marginBottom: "20px" }}>
              This action cannot be undone.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleDelete}
                style={{
                  marginRight: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#D41111",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Confirm Delete
              </button>
              <button
                onClick={closeDeleteModal}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#035E7B",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailTemplates;
