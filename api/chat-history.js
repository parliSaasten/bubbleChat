// API route di Vercel untuk menangani request POST dan GET chat history

let chatMap = {}; // key = ticketId, value = array of chat

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Tangani POST request untuk menyimpan chat
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

    return res.status(200).send('Chat saved');
  } 

  // Tangani GET request untuk mengambil chat berdasarkan ticketId
  else if (req.method === 'GET') {
    const ticketId = req.query.ticketId;
    if (!ticketId) return res.status(400).json({ error: 'ticketId is required' });

    res.status(200).json(chatMap[ticketId] || []);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
