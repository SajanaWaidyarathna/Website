document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('full-name'),
      email: formData.get('email-address'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    // Validate form
    if (!data.name || !data.email || !data.subject || !data.message) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    try {
      // Disable submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Send to Formspree (free service for static sites)
      const response = await fetch('https://formspree.io/f/mkoyjpwg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showMessage('Message sent successfully! We will get back to you soon.', 'success');
        contactForm.reset();
      } else {
        showMessage('Failed to send message. Please try again.', 'error');
      }

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    } catch (error) {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again later.', 'error');
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
      messageEl.style.backgroundColor = '#e8f8ef';
      messageEl.style.color = '#136c54';
      messageEl.style.border = '1px solid #a8e6d5';
    } else {
      messageEl.style.backgroundColor = '#fef2f2';
      messageEl.style.color = '#991b1b';
      messageEl.style.border = '1px solid #fecaca';
    }

    // Insert at the top of the form
    contactForm.insertBefore(messageEl, contactForm.firstChild);

    // Auto-remove success message after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
      }, 5000);
    }
  }
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(style);
