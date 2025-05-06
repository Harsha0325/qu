import React, { useCallback, useEffect, useState } from "react";
import Api from "../api";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  Snackbar,
  TablePagination,
} from "@mui/material";
import useCompanyId from "./useCompanyId";
import Loading from "../../FixedComponents/Loading";

const CreateVisitingPurpose = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [visitingPurposes, setVisitingPurposes] = useState([]);
  const [newPurposeName, setNewPurposeName] = useState("");
  const [newOptions, setNewOptions] = useState([""]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editPurpose, setEditPurpose] = useState(null);
  const [deletePurposeId, setDeletePurposeId] = useState(null);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { companyId, loading, error } = useCompanyId();

  const fetchVisitingPurposes = useCallback(async () => {
    try {
      const response = await Api.get(`/companies/${companyId}/visiting-purposes`);
      setVisitingPurposes(response.data);
    } catch (error) {
      showSnackbar("Error fetching visiting purposes", "error");
    }
  }, [companyId]);

  // Only fetch visiting purposes when companyId is available and loading is false
  useEffect(() => {
    if (!loading && companyId) {
      fetchVisitingPurposes();
    }
  }, [companyId, loading, fetchVisitingPurposes]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPurposeName.trim()) {
      showSnackbar("Purpose name is required", "error");
      return;
    }

    const newVisitingPurpose = {
      purposeName: newPurposeName.trim(),
      options: newOptions
        .filter((opt) => opt.trim())
        .map((optionName) => ({ optionName })),
    };

    try {
      if (editPurpose) {
        await Api.put(
          `/companies/${companyId}/visiting-purposes/${editPurpose.id}`,
          newVisitingPurpose
        );
        showSnackbar("Purpose updated successfully");
      } else {
        await Api.post(`/companies/${companyId}/visiting-purposes`, newVisitingPurpose);
        showSnackbar("Purpose created successfully");
      }
      resetForm();
      setIsModalVisible(false);
      fetchVisitingPurposes();
    } catch (error) {
      showSnackbar("Error saving visiting purpose", "error");
    }
  };

  const resetForm = () => {
    setNewPurposeName("");
    setNewOptions([""]);
    setEditPurpose(null);
  };

  const handleDelete = async () => {
    if (!deletePurposeId) return;

    try {
      await Api.delete(`/companies/${companyId}/visiting-purposes/${deletePurposeId}`);
      setIsDeleteConfirmVisible(false);
      setDeletePurposeId(null);
      fetchVisitingPurposes();
      showSnackbar("Purpose deleted successfully");
    } catch (error) {
      showSnackbar("Error deleting visiting purpose", "error");
    }
  };

  const showEditModal = (purpose) => {
    setEditPurpose(purpose);
    setNewPurposeName(purpose.purposeName);
    setNewOptions(purpose.options.map((option) => option.optionName));
    setIsModalVisible(true);
  };

  const handleOptionChange = (index, value) => {
    const optionsCopy = [...newOptions];
    optionsCopy[index] = value;
    setNewOptions(optionsCopy);
  };

  const handleAddNewOption = () => {
    setNewOptions([...newOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...newOptions];
    updatedOptions.splice(index, 1);
    setNewOptions(updatedOptions);
  };

  const confirmDelete = (id) => {
    setDeletePurposeId(id);
    setIsDeleteConfirmVisible(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTable = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedPurposes = visitingPurposes.slice(startIndex, endIndex);

    return (
      <div>
        <TableContainer component={Paper} className="shadow-md rounded-lg overflow-x-auto">
          <Table size={isTablet ? "small" : "medium"}>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-semibold text-gray-700" style={{ minWidth: "150px" }}>
                  Purpose
                </TableCell>
                <TableCell className="font-semibold text-gray-700" style={{ minWidth: "200px" }}>
                  Options
                </TableCell>
                <TableCell className="font-semibold text-gray-700" style={{ width: "100px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPurposes.map((purpose) => (
                <TableRow key={purpose.id} hover>
                  <TableCell className="font-medium">{purpose.purposeName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {purpose.options.map((option) => (
                        <span
                          key={option.id}
                          className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                        >
                          {option.optionName}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <IconButton
                        size="small"
                        onClick={() => showEditModal(purpose)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => confirmDelete(purpose.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <RiDeleteBin5Line />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={visitingPurposes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 15, 25]}
          className="mt-4"
        />
      </div>
    );
  };

  const renderCards = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedPurposes = visitingPurposes.slice(startIndex, endIndex);

    return (
      <div>
        <Grid container spacing={2}>
          {paginatedPurposes.map((purpose) => (
            <Grid item xs={12} sm={6} md={4} key={purpose.id}>
              <Card className="shadow-sm h-full">
                <CardContent>
                  <div className="flex justify-between items-start">
                    <Typography variant="h6" className="font-semibold">
                      {purpose.purposeName}
                    </Typography>
                    <div className="flex gap-1">
                      <IconButton
                        size="small"
                        onClick={() => showEditModal(purpose)}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => confirmDelete(purpose.id)}
                        className="text-red-600"
                      >
                        <RiDeleteBin5Line />
                      </IconButton>
                    </div>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {purpose.options.map((option) => (
                      <span
                        key={option.id}
                        className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                      >
                        {option.optionName}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <TablePagination
          component="div"
          count={visitingPurposes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 15, 25]}
          className="mt-4"
        />
      </div>
    );
  };

  // Render loading or error states before the main content
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-x-hidden">
      <Box className="space-y-2">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">
            Visiting Purposes
          </h2>

          <Button
            variant="contained"
            onClick={() => {
              resetForm();
              setIsModalVisible(true);
            }}
            sx={{
              backgroundColor: "#035E7B", 
              "&:hover": {
                backgroundColor: "#035E7B",
              },
            }}
            size={isTablet ? "small" : "medium"}
          >
            Create New Purpose
          </Button>
        </div>

        <div className="overflow-x-auto">{isMobile ? renderCards() : renderTable()}</div>

        <Modal
          open={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          className="flex justify-center items-center p-4"
        >
          <Box className="bg-white shadow-xl mx-4 p-4 sm:p-6 rounded-lg w-full max-w-md">
            <Typography variant="h6" className="mb-4">
              {editPurpose ? "Edit" : "Create"} Visiting Purpose
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                label="Purpose Name"
                value={newPurposeName}
                onChange={(e) => setNewPurposeName(e.target.value)}
                fullWidth
                required
                size={isTablet ? "small" : "medium"}
              />

              {newOptions.map((option, index) => (
                <Box key={index} className="flex items-center gap-2">
                  <TextField
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    fullWidth
                    size={isTablet ? "small" : "medium"}
                  />
                  {newOptions.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-600"
                      size="small"
                    >
                      <RiDeleteBin5Line />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button
                onClick={handleAddNewOption}
                variant="outlined"
                className="w-full"
                size={isTablet ? "small" : "medium"}
              >
                Add Option
              </Button>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#035E7B", 
                    "&:hover": {
                      backgroundColor: "#035E7B",
                    },
                  }}
                  size={isTablet ? "small" : "medium"}
                >
                  {editPurpose ? "Update" : "Create"}
                </Button>
                <Button
                  onClick={() => setIsModalVisible(false)}
                  variant="outlined"
                  fullWidth
                  size={isTablet ? "small" : "medium"}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Modal>

        <Modal
          open={isDeleteConfirmVisible}
          onClose={() => setIsDeleteConfirmVisible(false)}
          className="flex justify-center items-center p-4"
        >
          <Box className="bg-white shadow-xl mx-4 p-4 sm:p-6 rounded-lg w-full max-w-sm">
            <Typography variant="h6" className="mb-4">
              Confirm Delete
            </Typography>
            <Typography className="mb-6">
              Are you sure you want to delete this purpose? This action cannot be undone.
            </Typography>
            <div className="flex gap-4">
              <Button
                onClick={() => setIsDeleteConfirmVisible(false)}
                variant="outlined"
                fullWidth
                size={isTablet ? "small" : "medium"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                fullWidth
                size={isTablet ? "small" : "medium"}
              >
                Delete
              </Button>
            </div>
          </Box>
        </Modal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default CreateVisitingPurpose;