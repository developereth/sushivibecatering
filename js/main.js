// ========== MOBILE MENU TOGGLE ==========
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle functionality
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.main-nav ul');
  
  if (mobileToggle && navMenu) {
    // Toggle menu when clicking hamburger icon
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navMenu.classList.toggle('show');
    });
    
    // Close menu when clicking a navigation link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('show');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (navMenu.classList.contains('show')) {
        if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
          navMenu.classList.remove('show');
        }
      }
    });
    
    // Close menu on window resize (if screen becomes larger than mobile)
    window.addEventListener('resize', function() {
      if (window.innerWidth > 900) {
        navMenu.classList.remove('show');
      }
    });
  }
  
  // Gallery filter functionality
  initGalleryFilters();
  
  // Contact form handling
  initContactForm();
});

// Gallery filter functionality
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (!filterBtns.length) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formStatus = document.getElementById('formStatus');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    const formData = {
      name: document.getElementById('name')?.value,
      email: document.getElementById('email')?.value,
      phone: document.getElementById('phone')?.value,
      eventDate: document.getElementById('eventDate')?.value,
      inquiryType: document.getElementById('inquiryType')?.value,
      message: document.getElementById('message')?.value,
      newsletter: document.getElementById('newsletter')?.checked
    };
    
    if (!formData.name || !formData.email || !formData.message) {
      showFormStatus('Please fill in all required fields.', 'error', formStatus);
      return;
    }
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/sushivibes@proton.me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Sushi Vibe Contact: ${formData.inquiryType} - ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
          ...formData
        })
      });
      
      if (response.ok) {
        showFormStatus('✅ Message sent successfully! We\'ll get back to you within 24 hours.', 'success', formStatus);
        contactForm.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      const emailBody = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Event Date: ${formData.eventDate}
Inquiry: ${formData.inquiryType}

Message:
${formData.message}
      `);
      
      showFormStatus(
        `⚠️ Unable to send automatically. <a href="mailto:sushivibes@proton.me?subject=Sushi Vibe Inquiry - ${formData.name}&body=${emailBody}" style="color: #e31b23;">Click here to send via email</a>`,
        'warning',
        formStatus
      );
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormStatus(message, type, element) {
  if (!element) return;
  
  element.innerHTML = message;
  element.style.display = 'block';
  element.style.padding = '12px';
  element.style.borderRadius = '12px';
  element.style.marginTop = '1rem';
  
  switch(type) {
    case 'error':
      element.style.backgroundColor = '#ffe6e5';
      element.style.color = '#c93a3a';
      element.style.border = '1px solid #c93a3a';
      break;
    case 'success':
      element.style.backgroundColor = '#e6f4ea';
      element.style.color = '#2b6e3c';
      element.style.border = '1px solid #2b6e3c';
      break;
    case 'warning':
      element.style.backgroundColor = '#fff3cd';
      element.style.color = '#856404';
      element.style.border = '1px solid #ffc107';
      break;
  }
  
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}
