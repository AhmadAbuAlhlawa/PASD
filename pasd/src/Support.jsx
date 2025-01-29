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
} from "@mui/material";
import emailjs from "@emailjs/browser"; // Import EmailJS

const Support = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    supportType: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validation
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.supportType) newErrors.supportType = "Please select a support type";
    if (!formData.message) newErrors.message = "Message cannot be empty";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});

      // EmailJS Configuration
      const emailParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        from_phone: formData.phone,
        support_type: formData.supportType,
        message: formData.message,
      };

      emailjs
        .send(
          "service_s1vonuf", // Replace with your EmailJS Service ID
          "template_wwd97wa", // Replace with your EmailJS Template ID
          emailParams,
          "z0qg8nLJZ6eSKIy9w" // Replace with your EmailJS Public Key
        )
        .then((response) => {
          console.log("Email sent successfully!", response.status, response.text);
          alert("Support request sent successfully!");
          setFormData({ fullName: "", email: "", phone: "", supportType: "", message: "" }); // Reset form
        })
        .catch((error) => {
          console.error("Email failed to send:", error);
          alert("Failed to send the request. Please try again.");
        });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        my: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Support Form
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
            "& label.Mui-focused": { color: "black" }, // Label color on focus
            "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "black" }, // Black outline on focus
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
            "& label.Mui-focused": { color: "black" }, // Label color on focus
            "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "black" }, // Black outline on focus
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
            "& label.Mui-focused": { color: "black" }, // Label color on focus
            "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "black" }, // Black outline on focus
            },
        }}
        />
        <FormControl fullWidth margin="normal" sx={{
            "& label.Mui-focused": { color: "black" }, // Label color on focus
            "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "black" }, // Black border on focus
            }
        }}>
          <InputLabel>Support Type</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                label="Support Type"
                id="demo-simple-select"
                name="supportType"
                value={formData.supportType}
                onChange={handleChange}
            >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Archive support">Support with Us Archive</MenuItem>
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
            "& label.Mui-focused": { color: "black" }, // Label color on focus
            "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": { borderColor: "black" }, // Black outline on focus
            },
        }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, background: '#000' }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Support;
