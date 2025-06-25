let lastRenderedCount = 0;

async function fetchAndRender() {
  const chatContainer = document.getElementById('chat');
  const loadingIndicator = document.getElementById('loading');
  const errorContainer = document.getElementById('error');
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get("ticketId") || '9876543210';

  try {
    loadingIndicator.style.display = 'block';
    chatContainer.style.display = 'none';
    errorContainer.style.display = 'none';

    const res = await fetch(`https://bubble-chat-xi.vercel.app/api/chat-history?ticketId=${ticketId}`);
    const data = await res.json();

    if (data.length === lastRenderedCount) return;

    chatContainer.innerHTML = '';

    if (data.length === 0) {
      chatContainer.innerHTML = '<i>Belum ada snapshot.</i>';
    } else {
      data.forEach((msg) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = `
          <div class="sender">${msg.sender} (${msg.phone})</div>
          <div>${msg.text}</div>
          <div><small>📅 ${msg.time} | ${msg.isBot ? '🧠 Bot' : '🗣️ User'}</small></div>
        `;
        chatContainer.appendChild(bubble);
      });
    }

    lastRenderedCount = data.length;
    chatContainer.style.display = 'block';
  } catch (err) {
    console.error("❌ Gagal ambil data:", err);
    errorContainer.style.display = 'block';
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRender();
  setInterval(fetchAndRender, 10000); // refresh tiap 10 detik
});
