async function fetchAndRender() {
  const chatContainer = document.getElementById('chat');
  const errorContainer = document.getElementById('error');
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get("ticketId") || '9876543210'; // Default ticketId jika tidak ada

  try {
    const res = await fetch(`https://bubble-chat-xi.vercel.app/api/chat-history?ticketId=${ticketId}`);
    const data = await res.json();

    chatContainer.innerHTML = ''; // Reset konten chat sebelum di-render

    if (data.length === 0) {
      chatContainer.innerHTML = '<i>Belum ada snapshot.</i>';
      return;
    }

    data.forEach((msg) => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerHTML = ` 
        <div class="sender">${msg.sender} (${msg.phone})</div>
        <div>${msg.text}</div>
        <div><small>📅 ${msg.time} | 🧠 ${msg.isBot ? 'Bot' : 'User'}</small></div>
      `;
      chatContainer.appendChild(bubble);
    });
  } catch (err) {
    console.error("❌ Gagal ambil data:", err);
    chatContainer.style.display = 'none';
    errorContainer.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', fetchAndRender);
