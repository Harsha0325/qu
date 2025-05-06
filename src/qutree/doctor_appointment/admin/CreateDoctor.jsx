import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  // MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  // Avatar,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "@axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const doctorSchema = z.object({
  name: z.string().min(1, "Doctor name is required"),
  specialization: z
    .string()
    .min(1, "Specialization is required")
    .transform((val) => val.split(",").map((s) => s.trim())),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  // hospitalId: z
  //   .number({ invalid_type_error: "Hospital ID must be a number" })
  //   .min(1, "Hospital ID is required"),
  profilePicture: z
    .instanceof(File, { message: "Profile picture is required" })
    .refine((file) => file !== null, "Profile picture is required"),
});

function CreateDoctor() {
  // const [hospitals, setHospitals] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const profileInputRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      phoneNumber: "",
      // hospitalId: "",
      profilePicture: null,
    },
  });

  // useEffect(() => {
  //   const fetchHospitals = async () => {
  //     try {
  //       const res = await axios.get(`/hospitals/admin/${userId}/ids`);
  //       setHospitals(res.data.length > 0 ? res.data : []);
  //       if (res.data.length === 0)
  //         toast.warn("No hospitals found for this admin");
  //     } catch (err) {
  //       toast.error("Error fetching hospitals");
  //       console.error(err);
  //     }
  //   };
  //   fetchHospitals();
  // }, [userId]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profilePicture") {
      setValue("profilePicture", files[0] || null, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    if (!userId) {
      toast.error("User ID is missing from local storage");
      return;
    }

    setLoading(true);
    setShowModal(true);

    const formData = new FormData();
    formData.append("name", data.name);
    data.specialization.forEach((spec) =>
      formData.append("specialization", spec)
    );
    formData.append("phoneNumber", data.phoneNumber);
    if (!userId) {
      throw new Error("User ID is missing ,please do login again");
    }
    formData.append("adminId", userId);
    formData.append("profile_picture", data.profilePicture);

    try {
      const res = await axios.post("/doctors/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
      toast.success("Doctor created successfully!");

      setTimeout(() => {
        setShowModal(false);
        reset();
        navigate(0);
      }, 3000);
    } catch (err) {
      console.error("Error:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "Error creating doctor"
      );
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid justifyContent="center">
      <Grid
        item
        xs={12}
        md={6}
        border={0}
        sx={{ textAlign: "center", margin: "30px" }}
      >
        {/* <Card
          sx={{
            minWidth: 400,
            maxWidth: 600,
            minHeight: 500,
            p: 4,
            boxShadow: 3,
          }}
          // border should not have in mui
          border={0}
        > */}
        <Typography
          variant="h5"
          color="primary"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          Create New Doctor
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Doctor Name"
                {...register("name")}
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Specialization"
                {...register("specialization")}
                fullWidth
                variant="outlined"
                error={!!errors.specialization}
                helperText={
                  errors.specialization?.message ||
                  "e.g., Cardiology, Neurology"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                {...register("phoneNumber")}
                fullWidth
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            {/* <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.hospitalId}>
                  <InputLabel id="hospital-id-label">Hospital ID</InputLabel>
                  <TextField
                    select
                    labelId="hospital-id-label"
                    {...register("hospitalId", { valueAsNumber: true })}
                    value={watch("hospitalId") || ""}
                    onChange={(e) =>
                      setValue("hospitalId", Number(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                    fullWidth
                    variant="outlined"
                  >
                    <MenuItem value="" disabled>
                      Select a Hospital
                    </MenuItem>
                    {hospitals.map((id) => (
                      <MenuItem key={id} value={id}>
                        {id}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormHelperText>
                    {errors.hospitalId?.message || "Select a hospital"}
                  </FormHelperText>
                </FormControl>
              </Grid> */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.profilePicture}>
                <InputLabel shrink>Profile Picture *</InputLabel>
                <TextField
                  name="profilePicture"
                  type="file"
                  inputRef={profileInputRef}
                  onChange={handleFileChange}
                  fullWidth
                  variant="outlined"
                  inputProps={{ accept: "image/*" }}
                  required
                />
                <FormHelperText>
                  {errors.profilePicture?.message || "Upload one profile image"}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2, px: 4, py: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : "Create Doctor"}
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* </Card> */}
      </Grid>

      <Dialog
        open={showModal}
        PaperProps={{ sx: { textAlign: "center", p: 4 } }}
      >
        <DialogContent>
          {loading ? (
            <CircularProgress size={40} />
          ) : (
            <Box>
              <CheckCircleIcon color="success" sx={{ fontSize: 50 }} />
              <Typography variant="h6">Doctor Created Successfully!</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default CreateDoctor;
