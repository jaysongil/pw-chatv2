// File: client/chat.js
// Version: v1.2
// Updated: 2025-04-16 – Adds file/media upload support with Socket.IO
// Created by: Jayson Gilbertson

const socket = io();

// DOM references
const form = document.getElementById('messageForm');
const input = document.getElementById('message');
const file = document.getElementById('fileInput');
const chat = document.getElementById('chatWindow');

// Render new incoming message
socket.on('chat message', (msg) => {
  const div = document.createElement('div');
  let html = `<strong>${msg.sender}:</strong> ${msg.text}`;

  if (msg.media) {
    const ext = msg.media.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      html += `<br><img src="${msg.media}" style="max-width:200px; border-radius:6px; margin-top:6px;" />`;
    } else {
      html += `<br><a href="${msg.media}" target="_blank">📎 Download File</a>`;
    }
  }

  div.innerHTML = html;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// Submit message + optional file
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text && !file.files.length) return;

  let media = '';

  // Upload file (if present)
  if (file.files.length > 0) {
    const data = new FormData();
    data.append('file', file.files[0]);

    const res = await fetch('/pw-chat-v2/server/upload.php', {
      method: 'POST',
      body: data
    });

    const json = await res.json();
    if (json.success) {
      media = json.path;
    } else {
      alert("File upload failed.");
      return;
    }
  }

  socket.emit('chat message', {
    sender: 'You', // 🔁 Swap with member name on full integration
    text,
    media
  });

  input.value = '';
  file.value = '';
});
