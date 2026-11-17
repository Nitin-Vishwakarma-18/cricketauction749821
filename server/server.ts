import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { AuctionEngine } from './auctionEngine';

const PORT = process.env.PORT || 4000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'online', service: 'Cricket Auction Realtime Engine' }));
});

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Auction Socket] Client connected: ${socket.id}`);

  // Broadcast bid event to all screens (Admin + Projectors)
  socket.on('PLACE_BID', (data) => {
    console.log(`[Auction Socket] Bid placed by ${data.teamShortName} for ₹${data.amount}`);
    io.emit('BID_UPDATED', {
      ...data,
      timestamp: Date.now(),
    });
  });

  // Broadcast Sold event
  socket.on('MARK_SOLD', (data) => {
    console.log(`[Auction Socket] GAVEL STRUCK: ${data.playerName} sold to ${data.teamName} for ₹${data.amount}`);
    io.emit('PLAYER_SOLD', {
      ...data,
      timestamp: Date.now(),
    });
  });

  // Broadcast Unsold event
  socket.on('MARK_UNSOLD', (data) => {
    console.log(`[Auction Socket] GAVEL STRUCK: ${data.playerName} marked UNSOLD`);
    io.emit('PLAYER_UNSOLD', {
      ...data,
      timestamp: Date.now(),
    });
  });

  // Broadcast Undo event
  socket.on('UNDO_ACTION', (data) => {
    console.log(`[Auction Socket] UNDO executed by auctioneer`);
    io.emit('AUCTION_UNDONE', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Auction Socket] Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Cricket Auction Engine listening on port ${PORT}`);
});
