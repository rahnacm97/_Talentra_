import React, { useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Badge,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Chip,
  AppBar,
  Toolbar,
  ListItemButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as EmojiIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
  MoreVert as MoreVertIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  VolumeOff as MuteIcon,
  Block as BlockIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from "@mui/icons-material";
import Header from "./Header";

const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: 1,
      name: "TechCorp Inc.",
      role: "Senior React Developer",
      avatar: "T",
      lastMessage:
        "Thank you for your interest. We'd like to schedule an interview.",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Innovation Labs",
      role: "Product Manager",
      avatar: "I",
      lastMessage: "Your application has been reviewed successfully.",
      timestamp: "1 hour ago",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Design Studio",
      role: "UX Designer",
      avatar: "D",
      lastMessage: "We're impressed with your portfolio!",
      timestamp: "3 hours ago",
      unread: 1,
      online: false,
    },
    {
      id: 4,
      name: "Analytics Pro",
      role: "Data Scientist",
      avatar: "A",
      lastMessage: "Could you provide more details about your ML experience?",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 5,
      name: "StartupXYZ",
      role: "Full Stack Developer",
      avatar: "S",
      lastMessage: "Looking forward to our conversation!",
      timestamp: "2 days ago",
      unread: 0,
      online: true,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "them",
      content:
        "Hi! Thank you for applying to the Senior React Developer position.",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      content:
        "Thank you for reaching out! I'm very excited about this opportunity.",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "them",
      content:
        "We've reviewed your application and are impressed with your experience. Would you be available for a technical interview next week?",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      sender: "me",
      content:
        "Yes, I'm available next week. I'm flexible with timing. What days work best for your team?",
      timestamp: "10:38 AM",
    },
    {
      id: 5,
      sender: "them",
      content: "Great! How about Tuesday at 2 PM or Thursday at 10 AM?",
      timestamp: "10:40 AM",
    },
    {
      id: 6,
      sender: "me",
      content:
        "Tuesday at 2 PM works perfectly for me. Should I prepare anything specific for the interview?",
      timestamp: "10:42 AM",
    },
    {
      id: 7,
      sender: "them",
      content:
        "Perfect! We'll send you a calendar invite. The interview will be a technical discussion about React, TypeScript, and system design. Feel free to have some code examples ready to discuss.",
      timestamp: "10:45 AM",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const currentChat = conversations.find((c) => c.id === selectedChat);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "grey.50",
      }}
    >
      <Header />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT SIDEBAR – Conversation list */}
        <Paper sx={{ width: 320, display: "flex", flexDirection: "column" }}>
          <Box p={2} borderBottom={1} borderColor="divider">
            <TextField
              fullWidth
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Box>

          <List sx={{ flex: 1, overflowY: "auto" }} disablePadding>
            {filteredConversations.map((conv) => (
              <ListItem
                key={conv.id}
                disablePadding
                sx={{
                  bgcolor:
                    selectedChat === conv.id ? "primary.50" : "transparent",
                  borderLeft: selectedChat === conv.id ? 4 : 0,
                  borderColor:
                    selectedChat === conv.id ? "success.main" : "transparent",
                }}
              >
                <ListItemButton
                  selected={selectedChat === conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  sx={{
                    py: 2,
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                      color="success"
                      invisible={!conv.online}
                    >
                      <Avatar
                        sx={{
                          bgcolor: (theme) => theme.palette.primary.main,
                          fontWeight: "bold",
                        }}
                      >
                        {conv.avatar}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography noWrap fontWeight="medium">
                        {conv.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {conv.role}
                        </Typography>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={0.5}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            flex={1}
                          >
                            {conv.lastMessage}
                          </Typography>
                          {conv.unread > 0 && (
                            <Chip
                              label={conv.unread}
                              size="small"
                              color="success"
                            />
                          )}
                        </Box>
                      </>
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {conv.timestamp}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* CENTER – Chat area */}
        <Box flex={1} display="flex" flexDirection="column" bgcolor="grey.50">
          {currentChat ? (
            <>
              {/* Chat header */}
              <AppBar position="static" color="default" elevation={1}>
                <Toolbar
                  variant="dense"
                  sx={{ justifyContent: "space-between" }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                      color="success"
                      invisible={!currentChat.online}
                    >
                      <Avatar
                        sx={{
                          bgcolor: (theme) => theme.palette.primary.main,
                          fontWeight: "bold",
                        }}
                      >
                        {currentChat.avatar}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {currentChat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentChat.role}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <IconButton size="small">
                      <PhoneIcon />
                    </IconButton>
                    <IconButton size="small">
                      <VideocamIcon />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </Toolbar>
              </AppBar>

              {/* Messages */}
              <Box flex={1} p={3} overflow="auto">
                <Stack spacing={3}>
                  {messages.map((msg) => (
                    <Box
                      key={msg.id}
                      alignSelf={
                        msg.sender === "me" ? "flex-end" : "flex-start"
                      }
                      maxWidth="70%"
                    >
                      <Paper
                        elevation={msg.sender === "me" ? 0 : 1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor:
                            msg.sender === "me"
                              ? "success.main"
                              : "background.paper",
                          color:
                            msg.sender === "me"
                              ? "common.white"
                              : "text.primary",
                        }}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        align={msg.sender === "me" ? "right" : "left"}
                        display="block"
                        mt={0.5}
                      >
                        {msg.timestamp}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Message input */}
              <Paper elevation={3} sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} alignItems="flex-end">
                  <IconButton size="small">
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton size="small">
                    <EmojiIcon />
                  </IconButton>

                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    disabled={!message.trim()}
                    onClick={handleSendMessage}
                    sx={{ borderRadius: 3 }}
                  >
                    Send
                  </Button>
                </Stack>
              </Paper>
            </>
          ) : (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box textAlign="center">
                <Avatar
                  sx={{ width: 80, height: 80, bgcolor: "grey.300", mb: 2 }}
                >
                  <DescriptionIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a conversation from the sidebar to start messaging
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* RIGHT SIDEBAR – Chat info (only when a chat is selected) */}
        {currentChat && (
          <Paper sx={{ width: 320, overflowY: "auto" }}>
            <Box p={3}>
              {/* Profile */}
              <Box textAlign="center" mb={4}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  color="success"
                  invisible={!currentChat.online}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: (theme) => theme.palette.primary.main,
                      fontSize: "2rem",
                      fontWeight: "bold",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {currentChat.avatar}
                  </Avatar>
                </Badge>

                <Typography variant="h6" fontWeight="medium">
                  {currentChat.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentChat.role}
                </Typography>

                <Chip
                  size="small"
                  label={currentChat.online ? "Online" : "Offline"}
                  color={currentChat.online ? "success" : "default"}
                  icon={
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: currentChat.online
                          ? "success.main"
                          : "grey.400",
                        mr: 0.5,
                      }}
                    />
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Quick actions */}
              <Stack spacing={1} mb={3}>
                {[
                  { icon: <DescriptionIcon />, label: "View Job Details" },
                  { icon: <DescriptionIcon />, label: "View Application" },
                  { icon: <DescriptionIcon />, label: "Company Profile" },
                ].map((item, idx) => (
                  <Button
                    key={idx}
                    fullWidth
                    variant="outlined"
                    startIcon={item.icon}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      justifyContent: "space-between",
                      textTransform: "none",
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Shared files */}
              <Typography variant="subtitle2" gutterBottom>
                Shared Files
              </Typography>
              <Stack spacing={1} mb={3}>
                {[
                  { name: "Resume.pdf", size: "2.4 MB" },
                  { name: "Portfolio.pdf", size: "5.1 MB" },
                ].map((file, i) => (
                  <Paper
                    key={i}
                    variant="outlined"
                    sx={{ p: 2, display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: i % 2 === 0 ? "primary.100" : "secondary.100",
                        mr: 2,
                      }}
                    >
                      <DescriptionIcon />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {file.size}
                      </Typography>
                    </Box>
                    <IconButton color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Actions */}
              <Stack spacing={1}>
                <Button fullWidth startIcon={<MuteIcon />} color="inherit">
                  Mute Conversation
                </Button>
                <Button fullWidth startIcon={<BlockIcon />} color="error">
                  Block User
                </Button>
              </Stack>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
