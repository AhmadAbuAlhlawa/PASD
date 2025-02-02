import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import emailjs from "@emailjs/browser";

import "./css/Support.css";

const Support = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    supportType: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.supportType) newErrors.supportType = "Please select a support type";
    if (!formData.message) newErrors.message = "Message cannot be empty";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setLoading(true);

      const emailParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        from_phone: formData.phone,
        support_type: formData.supportType,
        message: formData.message,
      };

      emailjs
        .send("service_r7j83ad", "template_e4m0ybf", emailParams, "fxw-xExk1F2kzPdEF")
        .then((response) => {
          console.log("Email sent successfully!", response.status, response.text);
          alert("Support request sent successfully!");
          setFormData({ fullName: "", email: "", phone: "", supportType: "", message: "" });
        })
        .catch((error) => {
          console.error("Email failed to send:", error);
          alert("Failed to send the request. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Box
      className="support-form"
      sx={{
        maxWidth: 500,
        mx: "auto",
        my: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography className="heading" variant="h5" sx={{ mb: 1, textAlign: "center", fontWeight: "bold" }}>
        Support Form
      </Typography>
      <Typography sx={{textAlign: "center", mb: 3}}>
        Support us with Archive or Financially 
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#004437",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004437 !important",
            },
          }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#004437",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004437 !important",
            },
          }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#004437",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004437 !important",
            },
          }}
        />
        <FormControl fullWidth margin="normal" sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#004437",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#004437 !important",
          },
        }}>
          <InputLabel>Support Type</InputLabel>
          <Select
            label="Support Type"
            name="supportType"
            value={formData.supportType}
            onChange={handleChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Archive support">Support Us with Archive</MenuItem>
            <MenuItem value="Financial support">Support Us Financially</MenuItem>
          </Select>
        </FormControl>
        {errors.supportType && (
          <Typography color="error" sx={{ fontSize: 12, mt: 1 }}>
            {errors.supportType}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          error={!!errors.message}
          helperText={errors.message}
          margin="normal"
          multiline
          rows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#004437",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004437 !important",
            },
          }}
        />
        <Button type="submit" className="support_button" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit"}
        </Button>
      </form>
    </Box>
  );
};

export default Support;
