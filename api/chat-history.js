let chatMap = {}; // simpan global in-memory data

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
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
        sender: mentionFrom || 'Unknown',
        phone: mentionPhone || '-',
        text: mentionText || '-',
        group,
        time: mentionTimestamp || new Date().toISOString(),
        isBot: false
      };

      const replyChat = {
        sender: 'Bot',
        phone: '-',
        text: replyText || '-',
        group,
        time: replyTimestamp || new Date().toISOString(),
        isBot: true
      };

      if (!chatMap[ticketId]) chatMap[ticketId] = [];
      chatMap[ticketId].push(mentionChat, replyChat);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Error handling POST:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const ticketId = req.query.ticketId;
      if (!ticketId) return res.status(400).json({ error: 'ticketId is required' });

      return res.status(200).json(chatMap[ticketId] || []);
    } catch (err) {
      console.error('❌ Error handling GET:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
