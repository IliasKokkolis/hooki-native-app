const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (since no database for now)
const users = new Map();
const hooks = new Map();
const matches = new Map();
const messages = new Map();
const blockedUsers = new Map();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hooki API is running' });
});

// User routes
app.post('/api/users', (req, res) => {
  const { id, email, name, avatar } = req.body;
  const user = {
    id,
    email,
    name,
    avatar,
    bio: '',
    interests: [],
    photos: [],
    createdAt: new Date().toISOString()
  };
  users.set(id, user);
  res.json(user);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.put('/api/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const updated = { ...user, ...req.body };
  users.set(req.params.id, updated);
  
  // Update location separately if provided
  if (req.body.location) {
    updated.location = req.body.location;
  }
  
  res.json(updated);
});

// Hooks/Posts routes
app.post('/api/hooks', (req, res) => {
  const { userId, content, location, venueName } = req.body;
  const hookId = `hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const hook = {
    id: hookId,
    userId,
    content,
    location,
    venueName,
    likes: [],
    replies: [],
    createdAt: new Date().toISOString()
  };
  hooks.set(hookId, hook);
  io.emit('new_hook', hook);
  res.json(hook);
});

app.get('/api/hooks', (req, res) => {
  const { latitude, longitude, radius = 1000 } = req.query;
  const allHooks = Array.from(hooks.values());
  
  // Filter by location if provided
  let nearbyHooks = allHooks;
  if (latitude && longitude) {
    nearbyHooks = allHooks.filter(hook => {
      if (!hook.location) return false;
      const distance = getDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        hook.location.latitude,
        hook.location.longitude
      );
      return distance <= parseFloat(radius);
    });
  }
  
  // Enrich hooks with user information
  const enrichedHooks = nearbyHooks.map(hook => {
    const user = users.get(hook.userId);
    return {
      ...hook,
      userName: user?.name || 'Anonymous',
      userAvatar: user?.avatar || null,
    };
  });
  
  res.json(enrichedHooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/hooks/:hookId/like', (req, res) => {
  const hook = hooks.get(req.params.hookId);
  if (!hook) {
    return res.status(404).json({ error: 'Hook not found' });
  }
  const { userId } = req.body;
  if (!hook.likes.includes(userId)) {
    hook.likes.push(userId);
    hooks.set(req.params.hookId, hook);
    io.emit('hook_liked', { hookId: req.params.hookId, userId });
  }
  res.json(hook);
});

app.post('/api/hooks/:hookId/reply', (req, res) => {
  const hook = hooks.get(req.params.hookId);
  if (!hook) {
    return res.status(404).json({ error: 'Hook not found' });
  }
  const { userId, content } = req.body;
  const reply = {
    id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    content,
    createdAt: new Date().toISOString()
  };
  hook.replies.push(reply);
  hooks.set(req.params.hookId, hook);
  io.emit('hook_replied', { hookId: req.params.hookId, reply });
  res.json(reply);
});

// Matches routes
app.post('/api/matches', (req, res) => {
  const { userId1, userId2 } = req.body;
  const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const match = {
    id: matchId,
    userId1,
    userId2,
    createdAt: new Date().toISOString()
  };
  matches.set(matchId, match);
  io.to(userId1).emit('new_match', match);
  io.to(userId2).emit('new_match', match);
  res.json(match);
});

app.get('/api/matches/:userId', (req, res) => {
  const userMatches = Array.from(matches.values()).filter(
    m => m.userId1 === req.params.userId || m.userId2 === req.params.userId
  );
  res.json(userMatches);
});

// Messages routes
app.get('/api/messages/:matchId', (req, res) => {
  const matchMessages = messages.get(req.params.matchId) || [];
  res.json(matchMessages);
});

// Block/Report routes
app.post('/api/users/:userId/block', (req, res) => {
  const { blockedUserId } = req.body;
  const userBlocks = blockedUsers.get(req.params.userId) || [];
  if (!userBlocks.includes(blockedUserId)) {
    userBlocks.push(blockedUserId);
    blockedUsers.set(req.params.userId, userBlocks);
  }
  res.json({ success: true });
});

app.post('/api/users/:userId/report', (req, res) => {
  const { reportedUserId, reason } = req.body;
  // In a real app, this would be stored and reviewed by admins
  console.log(`User ${req.params.userId} reported ${reportedUserId}: ${reason}`);
  res.json({ success: true });
});

// Nearby users route
app.get('/api/users/nearby', (req, res) => {
  const { latitude, longitude, radius = 500 } = req.query;
  const allUsers = Array.from(users.values());
  
  // Filter users by location
  const nearbyUsers = allUsers.filter(user => {
    if (!user.location) return false;
    const distance = getDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      user.location.latitude,
      user.location.longitude
    );
    return distance <= parseFloat(radius);
  });
  
  res.json(nearbyUsers);
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_user', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on('send_message', (data) => {
    const { matchId, userId, content } = data;
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      matchId,
      userId,
      content,
      createdAt: new Date().toISOString()
    };
    
    const matchMessages = messages.get(matchId) || [];
    matchMessages.push(message);
    messages.set(matchId, matchMessages);
    
    const match = Array.from(matches.values()).find(
      m => m.id === matchId
    );
    
    if (match) {
      const recipientId = match.userId1 === userId ? match.userId2 : match.userId1;
      io.to(match.userId1).emit('new_message', message);
      io.to(match.userId2).emit('new_message', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Hooki API server running on port ${PORT}`);
});

