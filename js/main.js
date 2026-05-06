// ========== MOBILE SIDE SLIDE NAVIGATION ==========
document.addEventListener('DOMContentLoaded', function() {
  createMobileSidebar();
  initGalleryFilters();
  initContactForm();
});

// Create mobile sidebar navigation
function createMobileSidebar() {
  // Check if already exists
  if (document.querySelector('.mobile-nav-drawer')) return;
  
  // Get current page for active state
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Get logo image source
  const logoImg = document.querySelector('.logo img');
  const logoSrc = logoImg ? logoImg.src : 'logo.png';
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  document.body.appendChild(overlay);
  
  // Create drawer
  const drawer = document.createElement('div');
  drawer.className = 'mobile-nav-drawer';
  drawer.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-logo">
        <img src="${logoSrc}" alt="Sushi Vibe Logo">
        <span>Sushi Vibe</span>
      </div>
      <button class="close-drawer"><i class="fas fa-times"></i></button>
    </div>
    <div class="drawer-nav">
      <ul>
        <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}"><i class="fas fa-home"></i> Home</a></li>
        <li><a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}"><i class="fas fa-info-circle"></i> About</a></li>
        <li><a href="packages.html" class="${currentPage === 'packages.html' ? 'active' : ''}"><i class="fas fa-utensils"></i> Packages & Menu</a></li>
        <li><a href="gallery.html" class="${currentPage === 'gallery.html' ? 'active' : ''}"><i class="fas fa-images"></i> Gallery</a></li>
        <li><a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}"><i class="fas fa-envelope"></i> Contact</a></li>
        <li><a href="order.html" class="order-drawer-cta ${currentPage === 'order.html' ? 'active' : ''}"><i class="fas fa-shopping-cart"></i> Order Now</a></li>
      </ul>
    </div>
    <div class="drawer-contact">
      <p><i class="fas fa-phone-alt"></i> +251 927 299999</p>
      <p><i class="fas fa-envelope"></i> sushivibes@proton.me</p>
      <p><i class="fab fa-telegram"></i> @sushivib</p>
    </div>
    <div class="drawer-social">
      <a href="https://instagram.com/Sushi_vibe26" target="_blank"><i class="fab fa-instagram"></i></a>
      <a href="https://tiktok.com/@sushivibe.caterin" target="_blank"><i class="fab fa-tiktok"></i></a>
      <a href="https://t.me/sushivib" target="_blank"><i class="fab fa-telegram"></i></a>
    </div>
  `;
  document.body.appendChild(drawer);
  
  // Get mobile toggle button
  const mobileToggle = document.querySelector('.mobile-toggle');
  if (!mobileToggle) return;
  
  // Open drawer
  function openDrawer() {
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close drawer
  function closeDrawer() {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Event listeners
  mobileToggle.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelector('.close-drawer').addEventListener('click', closeDrawer);
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
  
  // Close when clicking a link
  drawer.querySelectorAll('.drawer-nav a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
  
  // Close on window resize (if screen becomes desktop size)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      closeDrawer();
    }
  });
}

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
