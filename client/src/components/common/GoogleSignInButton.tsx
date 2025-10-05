import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
} from "@mui/material";
 
const GoogleLogin: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleGoogleLogin = (role: "candidate" | "employer") => {
    const encodedRole = encodeURIComponent(role); 
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google?state=${encodedRole}`;
    console.log("Uri", window.location.href)
    setOpen(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Button
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        variant="outlined"
        color="inherit"
        startIcon={
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            width="20"
            height="20"
          />
        }
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "white",
          color: "black",
          boxShadow: 2,
          textTransform: "none",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        Continue with Google
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Your Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please choose how you want to continue:
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleGoogleLogin("candidate")}
            >
              Candidate
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGoogleLogin("employer")}
            >
              Employer
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GoogleLogin;


