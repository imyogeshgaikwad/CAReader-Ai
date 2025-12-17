// Chatbot functionality
document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const typingIndicator = document.getElementById('typing-indicator');
  const quickActionBtns = document.querySelectorAll('.quick-action-btn');

  // Toggle chatbot window
  chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hidden');
    if (!chatbotWindow.classList.contains('hidden')) {
      chatbotInput.focus();
      loadConversationHistory();
    }
  });

  // Close chatbot
  chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
  });

  // Handle form submission
  chatbotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    chatbotInput.value = '';

    // Show typing indicator
    typingIndicator.classList.remove('hidden');
    scrollToBottom();

    try {
      // Send message to AI
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      // Hide typing indicator
      typingIndicator.classList.add('hidden');

      if (data.success) {
        addMessage('bot', data.message);
      } else {
        addMessage('bot', 'Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      typingIndicator.classList.add('hidden');
      addMessage('bot', 'Sorry, I\'m having trouble connecting. Please try again later.');
    }
  });

  // Handle quick actions
  quickActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      
      switch (action) {
        case 'recommendations':
          chatbotInput.value = 'I need travel destination recommendations';
          break;
        case 'itinerary':
          chatbotInput.value = 'Help me plan a travel itinerary';
          break;
        case 'tips':
          chatbotInput.value = 'Give me some travel tips';
          break;
      }
      
      chatbotForm.dispatchEvent(new Event('submit'));
    });
  });

  // Add message to chat
  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = role === 'bot' ? 'AI' : 'You';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Convert markdown-style formatting to HTML
    const formattedContent = formatMessage(content);
    contentDiv.innerHTML = formattedContent;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    
    scrollToBottom();
  }

  // Format message content
  function formatMessage(text) {
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Convert bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert bullet points
    text = text.replace(/^[-•]\s(.+)$/gm, '<li>$1</li>');
    if (text.includes('<li>')) {
      text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    }
    
    // Convert numbered lists
    text = text.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
    
    return text;
  }

  // Scroll to bottom of messages
  function scrollToBottom() {
    setTimeout(() => {
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 100);
  }

  // Load conversation history
  async function loadConversationHistory() {
    try {
      const response = await fetch('/api/ai/conversation-history');
      const data = await response.json();
      
      if (data.success && data.messages.length > 0) {
        // Clear welcome message
        chatbotMessages.innerHTML = '';
        
        // Add previous messages
        data.messages.forEach(msg => {
          addMessage(msg.role === 'user' ? 'user' : 'bot', msg.content);
        });
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }

  // Helper function for other pages to trigger chatbot
  window.openChatbot = function(message) {
    chatbotWindow.classList.remove('hidden');
    if (message) {
      chatbotInput.value = message;
      chatbotForm.dispatchEvent(new Event('submit'));
    }
    chatbotInput.focus();
  };
});