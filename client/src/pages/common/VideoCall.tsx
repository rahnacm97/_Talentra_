import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Avatar,
  Badge,
  IconButton,
  Button,
  TextField,
  Typography,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  Tooltip,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  MoreVert as MoreVertIcon,
  CallEnd as CallEndIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Close as CloseIcon,
  FiberManualRecord as RecordIcon,
} from "@mui/icons-material";

const VideoCallPage: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);

  const participants = [
    {
      id: 1,
      name: "You",
      role: "Candidate",
      avatar: "Y",
      isMuted,
      isVideoOff,
      isHost: false,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "HR Manager - TechCorp",
      avatar: "S",
      isMuted: false,
      isVideoOff: false,
      isHost: true,
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Technical Lead - TechCorp",
      avatar: "M",
      isMuted: true,
      isVideoOff: false,
      isHost: false,
    },
  ];

  const chatMessages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      message: "Welcome to the interview! Let's get started.",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "You",
      message: "Thank you! I'm excited to be here.",
      timestamp: "10:31 AM",
    },
    {
      id: 3,
      sender: "Michael Chen",
      message: "Feel free to share your screen when discussing your projects.",
      timestamp: "10:32 AM",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log("Sending message:", chatMessage);
      setChatMessage("");
    }
  };

  const handleEndCall = () => {
    if (window.confirm("Are you sure you want to end the call?")) {
      window.location.href = "/messages";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "grey.900",
      }}
    >
      {/* Top Bar */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: "grey.800" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
              <Typography fontWeight="bold" fontSize="0.75rem">
                T
              </Typography>
            </Avatar>
            <Typography variant="subtitle1" color="white" fontWeight="medium">
              Talentra Interview
            </Typography>
            <Chip
              icon={
                <RecordIcon sx={{ color: "white !important", fontSize: 12 }} />
              }
              label={formatDuration(callDuration)}
              size="small"
              sx={{
                bgcolor: "error.main",
                color: "white",
                animation: "pulse 1.5s infinite",
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton color="inherit" size="small">
              <SettingsIcon />
            </IconButton>
            <IconButton color="inherit" size="small">
              <BarChartIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content: Flex Row */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Video Grid */}
        <Box sx={{ flex: 1, p: 2 }}>
          <Grid container spacing={2} sx={{ height: "100%" }}>
            {/* Host */}
            <Grid size={{ xs: 4 }}>
              <Paper
                elevation={6}
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #1e3a8a, #6b21a8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box textAlign="center">
                  <Avatar
                    sx={{
                      width: 128,
                      height: 128,
                      fontSize: "3rem",
                      fontWeight: "bold",
                      bgcolor: "primary.main",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    S
                  </Avatar>
                  <Typography variant="h5" color="white" fontWeight="medium">
                    Sarah Johnson
                  </Typography>
                  <Typography variant="body2" color="grey.300">
                    HR Manager - TechCorp
                  </Typography>
                </Box>
                <Paper
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Sarah Johnson
                  </Typography>
                  <MicIcon fontSize="small" />
                </Paper>
                <Chip
                  label="Presenting"
                  size="small"
                  color="primary"
                  sx={{ position: "absolute", top: 16, left: 16 }}
                />
              </Paper>
            </Grid>

            {/* Michael */}
            <Grid size={{ xs: 4 }}>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box textAlign="center">
                  <Avatar
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      bgcolor: "info.main",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    M
                  </Avatar>
                  <Typography variant="h6" color="white">
                    Michael Chen
                  </Typography>
                  <Typography variant="caption" color="grey.300">
                    Technical Lead
                  </Typography>
                </Box>
                <Paper
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="caption">Michael Chen</Typography>
                  <MicOffIcon fontSize="small" sx={{ color: "error.light" }} />
                </Paper>
              </Paper>
            </Grid>

            {/* You */}
            <Grid size={{ xs: 4 }}>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  border: 3,
                  borderColor: "primary.main",
                  background: "linear-gradient(135deg, #166534, #14b8a6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isVideoOff ? (
                  <Box textAlign="center">
                    <Avatar
                      sx={{
                        width: 96,
                        height: 96,
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        bgcolor: "success.main",
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      Y
                    </Avatar>
                    <Typography variant="h6" color="white">
                      You
                    </Typography>
                    <Typography variant="caption" color="grey.300">
                      Candidate
                    </Typography>
                  </Box>
                ) : (
                  <Box textAlign="center">
                    <Avatar
                      sx={{
                        width: 96,
                        height: 96,
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        bgcolor: "success.main",
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      Y
                    </Avatar>
                    <Typography variant="h6" color="white">
                      You
                    </Typography>
                  </Box>
                )}
                <Paper
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="caption">You</Typography>
                  {isMuted && (
                    <MicOffIcon
                      fontSize="small"
                      sx={{ color: "error.light" }}
                    />
                  )}
                  {isVideoOff && (
                    <VideocamOffIcon
                      fontSize="small"
                      sx={{ color: "error.light" }}
                    />
                  )}
                </Paper>
                <Chip
                  label="You"
                  size="small"
                  color="primary"
                  sx={{ position: "absolute", top: 12, right: 12 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Chat Sidebar */}
        {showChat && (
          <Paper
            sx={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              bgcolor: "grey.800",
            }}
          >
            <Box
              p={2}
              borderBottom={1}
              borderColor="grey.700"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="white">
                Chat
              </Typography>
              <IconButton
                onClick={() => setShowChat(false)}
                size="small"
                sx={{ color: "grey.400" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box flex={1} p={2} overflow="auto">
              <Stack spacing={2}>
                {chatMessages.map((msg) => (
                  <Box key={msg.id}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        color="primary.main"
                        fontWeight="medium"
                      >
                        {msg.sender}
                      </Typography>
                      <Typography variant="caption" color="grey.500">
                        {msg.timestamp}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="grey.300">
                      {msg.message}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box p={2} borderTop={1} borderColor="grey.700">
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "grey.700",
                      color: "white",
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  sx={{ borderRadius: 2 }}
                >
                  Send
                </Button>
              </Stack>
            </Box>
          </Paper>
        )}

        {/* Participants Sidebar */}
        {showParticipants && (
          <Paper
            sx={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              bgcolor: "grey.800",
            }}
          >
            <Box
              p={2}
              borderBottom={1}
              borderColor="grey.700"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" color="white">
                Participants ({participants.length})
              </Typography>
              <IconButton
                onClick={() => setShowParticipants(false)}
                size="small"
                sx={{ color: "grey.400" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box flex={1} p={2} overflow="auto">
              <Stack spacing={1.5}>
                {participants.map((p) => (
                  <Paper
                    key={p.id}
                    sx={{ p: 2, bgcolor: "grey.700", borderRadius: 2 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {p.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            color="white"
                            fontWeight="medium"
                          >
                            {p.name}
                            {p.isHost && (
                              <Chip
                                label="Host"
                                size="small"
                                color="warning"
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="grey.400">
                            {p.role}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        {p.isMuted && (
                          <MicOffIcon
                            fontSize="small"
                            sx={{ color: "error.light" }}
                          />
                        )}
                        {p.isVideoOff && (
                          <VideocamOffIcon
                            fontSize="small"
                            sx={{ color: "error.light" }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Bottom Controls */}
      <Paper
        elevation={3}
        sx={{
          bgcolor: "grey.800",
          p: 2,
          borderTop: 1,
          borderColor: "grey.700",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ maxWidth: 1200, mx: "auto" }}
        >
          {/* Left */}
          <Stack direction="row" spacing={1}>
            <Tooltip title={isMuted ? "Unmute" : "Mute"}>
              <IconButton
                onClick={() => setIsMuted(!isMuted)}
                color={isMuted ? "error" : "inherit"}
                sx={{
                  bgcolor: isMuted ? "error.main" : "grey.700",
                  "&:hover": { bgcolor: isMuted ? "error.dark" : "grey.600" },
                  width: 56,
                  height: 56,
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={isVideoOff ? "Turn on camera" : "Turn off camera"}>
              <IconButton
                onClick={() => setIsVideoOff(!isVideoOff)}
                color={isVideoOff ? "error" : "inherit"}
                sx={{
                  bgcolor: isVideoOff ? "error.main" : "grey.700",
                  "&:hover": {
                    bgcolor: isVideoOff ? "error.dark" : "grey.600",
                  },
                  width: 56,
                  height: 56,
                }}
              >
                {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Center */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Share screen">
              <Button
                variant={isScreenSharing ? "contained" : "outlined"}
                startIcon={
                  isScreenSharing ? (
                    <StopScreenShareIcon />
                  ) : (
                    <ScreenShareIcon />
                  )
                }
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                sx={{ borderRadius: 3, minWidth: 140 }}
              >
                {isScreenSharing ? "Stop" : "Share"}
              </Button>
            </Tooltip>
            <Tooltip title="Chat">
              <Badge badgeContent={3} color="error">
                <IconButton
                  onClick={() => setShowChat(!showChat)}
                  sx={{
                    bgcolor: "grey.700",
                    "&:hover": { bgcolor: "grey.600" },
                    width: 56,
                    height: 56,
                  }}
                >
                  <ChatIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Tooltip title="Participants">
              <IconButton
                onClick={() => setShowParticipants(!showParticipants)}
                sx={{
                  bgcolor: "grey.700",
                  "&:hover": { bgcolor: "grey.600" },
                  width: 56,
                  height: 56,
                }}
              >
                <PeopleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reactions">
              <IconButton
                sx={{
                  bgcolor: "grey.700",
                  "&:hover": { bgcolor: "grey.600" },
                  width: 56,
                  height: 56,
                }}
              >
                <EmojiEmotionsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More">
              <IconButton
                sx={{
                  bgcolor: "grey.700",
                  "&:hover": { bgcolor: "grey.600" },
                  width: 56,
                  height: 56,
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Right */}
          <Button
            variant="contained"
            color="error"
            startIcon={<CallEndIcon />}
            onClick={handleEndCall}
            sx={{ px: 4, py: 2, borderRadius: 3, fontWeight: "medium" }}
          >
            End Call
          </Button>
        </Stack>
      </Paper>

      {/* Notifications */}
      {isScreenSharing && (
        <Alert
          icon={<ScreenShareIcon />}
          severity="info"
          sx={{
            position: "fixed",
            top: 80,
            right: 24,
            zIndex: 50,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          You are sharing your screen
        </Alert>
      )}

      <Alert
        icon={
          <RecordIcon
            sx={{ color: "white", animation: "pulse 1.5s infinite" }}
          />
        }
        severity="success"
        sx={{
          position: "fixed",
          top: 80,
          left: 24,
          zIndex: 50,
          bgcolor: "success.main",
          color: "white",
        }}
      >
        Good Connection
      </Alert>
    </Box>
  );
};

export default VideoCallPage;
