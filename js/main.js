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
        <li><a href="reviews.html" class="${currentPage === 'reviews.html' ? 'active' : ''}"><i class="fas fa-star"></i> Reviews</a></li>
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

// Order form handling (for order page)
function initOrderForm() {
  const orderForm = document.getElementById('orderForm');
  if (!orderForm) return;
  
  // Package selection
  const radioPackages = document.querySelectorAll('input[name="package"]');
  const summaryPackageSpan = document.getElementById('summaryPackage');
  const summaryPriceSpan = document.getElementById('summaryPrice');
  const totalPriceSpan = document.getElementById('totalPrice');
  const guestCountInput = document.getElementById('guestCount');
  const deliveryRadio = document.querySelectorAll('input[name="deliveryType"]');
  const deliveryFeeSpan = document.getElementById('deliveryFee');
  
  function updateSummary() {
    let selected = null;
    for(let r of radioPackages) {
      if(r.checked) {
        selected = r;
        break;
      }
    }
    if(selected) {
      const pkgName = selected.value;
      const price = parseInt(selected.dataset.price);
      const people = selected.dataset.people;
      if(summaryPackageSpan) summaryPackageSpan.innerText = pkgName;
      if(summaryPriceSpan) summaryPriceSpan.innerText = price.toLocaleString() + ' ETB';
      if(guestCountInput) guestCountInput.value = people;
      const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
      if(deliveryFeeSpan) deliveryFeeSpan.innerHTML = deliveryType === 'Delivery' ? 'To be quoted' : '0 ETB (pickup)';
      let totalDisplay = price.toLocaleString() + ' ETB';
      if(deliveryType === 'Delivery') totalDisplay = price.toLocaleString() + ' ETB + delivery fee';
      if(totalPriceSpan) totalPriceSpan.innerText = totalDisplay;
    } else {
      if(summaryPackageSpan) summaryPackageSpan.innerText = '—';
      if(summaryPriceSpan) summaryPriceSpan.innerText = '0 ETB';
      if(guestCountInput) guestCountInput.value = '';
      if(totalPriceSpan) totalPriceSpan.innerText = '0 ETB';
    }
  }
  
  if(radioPackages.length) {
    radioPackages.forEach(r => r.addEventListener('change', updateSummary));
  }
  if(deliveryRadio.length) {
    deliveryRadio.forEach(d => d.addEventListener('change', updateSummary));
  }
  
  // Show/hide delivery address
  const deliveryGroup = document.getElementById('deliveryAddressGroup');
  function toggleAddress() {
    const val = document.querySelector('input[name="deliveryType"]:checked')?.value;
    if(deliveryGroup) {
      if(val === 'Delivery') deliveryGroup.style.display = 'block';
      else deliveryGroup.style.display = 'none';
    }
  }
  if(deliveryRadio.length) {
    deliveryRadio.forEach(r => r.addEventListener('change', toggleAddress));
  }
  toggleAddress();
  
  // Save order to localStorage
  function saveOrderToLocalStorage(orderData) {
    try {
      let existingOrders = JSON.parse(localStorage.getItem('sushi_vibe_orders') || '[]');
      const newOrder = {
        order_id: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        order_date: new Date().toISOString(),
        status: 'pending',
        ...orderData
      };
      existingOrders.unshift(newOrder);
      localStorage.setItem('sushi_vibe_orders', JSON.stringify(existingOrders));
      return newOrder.order_id;
    } catch(e) {
      return null;
    }
  }
  
  // Submit order
  orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const pkgSelected = document.querySelector('input[name="package"]:checked');
    if(!pkgSelected) { 
      showOrderStatus('❌ Please select a catering package.', 'error');
      return; 
    }
    
    const dateVal = document.getElementById('eventDate')?.value;
    if(!dateVal) { 
      showOrderStatus('❌ Please select event date (24h advance notice).', 'error');
      return; 
    }
    
    const timeVal = document.getElementById('eventTime')?.value;
    if(!timeVal) { 
      showOrderStatus('❌ Please select event time.', 'error');
      return; 
    }
    
    const nameVal = document.getElementById('fullName')?.value.trim();
    if(!nameVal) { 
      showOrderStatus('❌ Please enter your full name.', 'error');
      return; 
    }
    
    const phoneVal = document.getElementById('phone')?.value.trim();
    if(!phoneVal) { 
      showOrderStatus('❌ Phone number required.', 'error');
      return; 
    }
    
    const emailVal = document.getElementById('email')?.value.trim();
    if(!emailVal) { 
      showOrderStatus('❌ Email address required.', 'error');
      return; 
    }
    
    const allergyVal = document.getElementById('allergies')?.value.trim();
    if(!allergyVal) { 
      showOrderStatus('⚠️ Please tell us about any allergies (even if "none").', 'error');
      return; 
    }
    
    const orderData = {
      full_name: nameVal,
      phone: phoneVal,
      email: emailVal,
      package: pkgSelected.value,
      package_price: pkgSelected.dataset.price,
      guests: pkgSelected.dataset.people,
      event_date: dateVal,
      event_time: timeVal,
      occasion: document.getElementById('occasion')?.value || '',
      delivery_type: document.querySelector('input[name="deliveryType"]:checked')?.value,
      delivery_address: document.getElementById('address')?.value || '',
      allergies: allergyVal,
      special_requests: document.getElementById('specialRequests')?.value || ''
    };
    
    showOrderStatus('📤 Submitting your order...', 'loading');
    
    const orderId = saveOrderToLocalStorage(orderData);
    
    // Send email notification
    try {
      const emailBody = `
📦 NEW SUSHI ORDER #${orderId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CUSTOMER DETAILS:
   Name: ${orderData.full_name}
   Phone: ${orderData.phone}
   Email: ${orderData.email}

🍣 ORDER DETAILS:
   Package: ${orderData.package}
   Price: ${orderData.package_price} ETB
   Guests: ${orderData.guests}
   Event Date: ${orderData.event_date}
   Event Time: ${orderData.event_time}
   Occasion: ${orderData.occasion || 'Not specified'}

🚚 DELIVERY:
   Type: ${orderData.delivery_type}
   Address: ${orderData.delivery_address || 'N/A'}

⚠️ SPECIAL NOTES:
   Allergies: ${orderData.allergies}
   Requests: ${orderData.special_requests || 'None'}
      `;
      
      await fetch('https://formsubmit.co/ajax/sushivibes@proton.me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `🆕 NEW SUSHI ORDER #${orderId}`,
          message: emailBody
        })
      });
    } catch(e) {}
    
    showOrderStatus(`
      ✅ <strong>Order received!</strong><br>
      Order #${orderId || 'received'}<br><br>
      We will contact you within 2 hours to confirm delivery details.<br><br>
      📞 Call us: +251 927 299999 if urgent.<br>
      🍣 Thank you for choosing Sushi Vibe!
    `, 'success');
    
    orderForm.reset();
    updateSummary();
    toggleAddress();
    
    const statusDiv = document.getElementById('orderStatus');
    if(statusDiv) statusDiv.scrollIntoView({ behavior: 'smooth' });
  });
  
  function showOrderStatus(message, type) {
    const orderStatus = document.getElementById('orderStatus');
    if(!orderStatus) return;
    
    orderStatus.innerHTML = message;
    orderStatus.style.padding = '1rem';
    orderStatus.style.borderRadius = '12px';
    orderStatus.style.marginTop = '1rem';
    
    switch(type) {
      case 'error':
        orderStatus.style.backgroundColor = '#ffe6e5';
        orderStatus.style.color = '#c93a3a';
        orderStatus.style.border = '1px solid #c93a3a';
        break;
      case 'success':
        orderStatus.style.backgroundColor = '#e6f4ea';
        orderStatus.style.color = '#2b6e3c';
        orderStatus.style.border = '1px solid #2b6e3c';
        break;
      case 'warning':
        orderStatus.style.backgroundColor = '#fff3cd';
        orderStatus.style.color = '#856404';
        orderStatus.style.border = '1px solid #ffc107';
        break;
      case 'loading':
        orderStatus.style.backgroundColor = '#e31b23';
        orderStatus.style.color = 'white';
        orderStatus.style.border = 'none';
        break;
    }
  }
  
  // Auto-update from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const preset = urlParams.get('package');
  if(preset === 'vibe') document.querySelector('input[value="Vibe Party Set"]')?.click();
  if(preset === 'celebration') document.querySelector('input[value="Celebration Feast"]')?.click();
  if(preset === 'ultimate') document.querySelector('input[value="Ultimate Sushi Experience"]')?.click();
  updateSummary();
}

// Helper function for form status
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

// Initialize order form if on order page
if (document.getElementById('orderForm')) {
  initOrderForm();
}
