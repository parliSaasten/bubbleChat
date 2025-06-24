const express = require('express');
const app = express();
const port = 5001;

app.use(express.json());

let chatMap = {}; // key = ticketId, value = array of chat

// Menangani POST request untuk menyimpan chat
app.post('/api/push-chat', (req, res) => {
  const { ticketId, group, mentionText, mentionFrom, mentionPhone, mentionTimestamp, replyText, replyTimestamp, responseTimeInSeconds } = req.body;

  if (!ticketId) return res.status(400).json({ error: 'ticketId is required' });

  const chat = {
    sender: mentionFrom,
    phone: mentionPhone,
    text: replyText,
    group,
    time: replyTimestamp,
    isBot: true
  };

  if (!chatMap[ticketId]) chatMap[ticketId] = [];
  chatMap[ticketId].push(chat);

  console.log(`Data untuk ticketId ${ticketId} disimpan:`, chatMap[ticketId]); // Debug log untuk melihat data yang disimpan

  return res.status(200).send('Chat saved');
});

// Menangani GET request untuk mengambil chat berdasarkan ticketId
app.get('/api/chat-history', (req, res) => {
  const ticketId = req.query.ticketId;
  if (!ticketId) return res.status(400).json({ error: 'ticketId is required' });

  res.status(200).json(chatMap[ticketId] || []);
});

app.listen(port, () => {
  console.log(`✅ API Server running at https://127.0.0.1:${port}`);
});
