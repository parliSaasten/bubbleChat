import Cors from 'cors';

// Inisialisasi CORS
const cors = Cors({
  methods: ['GET', 'POST'],
  origin: '*',  // Atau ganti dengan origin frontend yang diizinkan, misalnya 'https://bubble-chat-xi.vercel.app'
});

let chatMap = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const {
      ticketId,
      group,
      mentionText,
      mentionFrom,
      mentionPhone,
      mentionTimestamp,
      replyText,
      replyTimestamp,
      responseTimeInSeconds
    } = req.body;

    if (!ticketId) return res.status(400).json({ error: 'ticketId is required' });

    const mentionChat = {
      sender: mentionFrom,
      phone: mentionPhone,
      text: mentionText,
      group,
      time: mentionTimestamp,
      isBot: false
    };

    const replyChat = {
      sender: 'Bot',
      phone: '-',
      text: replyText,
      group,
      time: replyTimestamp,
      isBot: true
    };

    if (!chatMap[ticketId]) chatMap[ticketId] = [];
    chatMap[ticketId].push(mentionChat, replyChat);

    return res.status(200).send('Mention + Reply saved');
  }

  if (req.method === 'GET') {
    const ticketId = req.query.ticketId;
    return res.status(200).json(chatMap[ticketId] || []);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
