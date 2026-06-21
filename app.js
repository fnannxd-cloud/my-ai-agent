const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// إضافة رسالة للشات
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// إرسال الطلب للسيرفر المخفي (Netlify Function)
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    
    // رسالة انتظار مؤقتة
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai-message');
    loadingDiv.textContent = 'جاري التحليل والتفكير...';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // هنا نكلم الـ Function اللي موجودة على Netlify
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            body: JSON.stringify({ message: text }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        chatBox.removeChild(loadingDiv); // حذف رسالة الانتظار
        addMessage(data.reply, 'ai');

    } catch (error) {
        chatBox.removeChild(loadingDiv);
        addMessage('عذراً، حدث خطأ في الاتصال بالخادم.', 'ai');
        console.error(error);
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});