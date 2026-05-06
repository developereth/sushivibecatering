// ========== CUSTOMER REVIEWS SYSTEM ==========
const STORAGE_KEY = 'sushi_vibe_reviews';

// Sample initial reviews
const defaultReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "Absolutely amazing sushi! We ordered the Celebration Feast for my birthday party. Every guest was impressed. The presentation was beautiful and the fish was so fresh. Will definitely order again!",
    date: "2026-04-15",
    email: "sarah@example.com"
  },
  {
    id: 2,
    name: "Michael T.",
    rating: 5,
    text: "Best sushi catering in Addis! The Ultimate Sushi Experience was perfect for our corporate event. Professional delivery, everything on time, and the quality was outstanding. Highly recommended!",
    date: "2026-04-10",
    email: "michael@example.com"
  },
  {
    id: 3,
    name: "Eden G.",
    rating: 4,
    text: "Great experience! The Vibe Party Set was perfect for our small gathering. Sushi was delicious and the free wasabi/ginger was a nice touch. Will order again for sure.",
    date: "2026-04-05",
    email: "eden@example.com"
  }
];

// Initialize reviews
function initReviews() {
  let reviews = localStorage.getItem(STORAGE_KEY);
  if (!reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
  }
  displayReviews();
  updateRatingSummary();
}

// Get all reviews
function getReviews() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// Save review
function saveReview(review) {
  const reviews = getReviews();
  review.id = Date.now();
  review.date = new Date().toISOString().split('T')[0];
  reviews.unshift(review);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  displayReviews();
  updateRatingSummary();
}

// Display reviews
function displayReviews() {
  const reviews = getReviews();
  const grid = document.getElementById('reviewsGrid');
  
  if (!grid) return;
  
  if (reviews.length === 0) {
    grid.innerHTML = `
      <div class="no-reviews">
        <i class="fas fa-comment-dots" style="font-size: 3rem; color: #e31b23; margin-bottom: 1rem; display: block;"></i>
        <h3>No reviews yet</h3>
        <p>Be the first to leave a review!</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-stars">
        ${generateStars(review.rating)}
      </div>
      <p class="review-text">"${escapeHtml(review.text)}"</p>
      <div class="review-author">
        <div class="avatar">${review.name.charAt(0)}</div>
        <div class="info">
          <h4>${escapeHtml(review.name)}</h4>
          <p>Verified Customer</p>
        </div>
        <div class="review-date">${review.date}</div>
      </div>
    </div>
  `).join('');
}

// Generate star HTML
function generateStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

// Update rating summary
function updateRatingSummary() {
  const reviews = getReviews();
  const total = reviews.length;
  
  if (total === 0) return;
  
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = (sum / total).toFixed(1);
  
  // Count ratings
  const ratingCounts = {5:0, 4:0, 3:0, 2:0, 1:0};
  reviews.forEach(r => {
    ratingCounts[r.rating]++;
  });
  
  // Update average display
  const avgElement = document.querySelector('.average-rating');
  if (avgElement) {
    avgElement.querySelector('.avg-number').textContent = average;
    avgElement.querySelector('.avg-stars').innerHTML = generateStars(Math.round(average));
    avgElement.querySelector('.avg-count').textContent = `${total} review${total !== 1 ? 's' : ''}`;
  }
  
  // Update rating bars
  for (let i = 5; i >= 1; i--) {
    const percent = total > 0 ? (ratingCounts[i] / total) * 100 : 0;
    const barItem = document.querySelector(`.rating-bar-item:nth-child(${6-i})`);
    if (barItem) {
      barItem.querySelector('.bar-fill').style.width = `${percent}%`;
      barItem.querySelector('.count').textContent = ratingCounts[i];
    }
  }
}

// Submit review form
function initReviewForm() {
  const form = document.getElementById('reviewForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const rating = document.querySelector('input[name="rating"]:checked');
    const text = document.getElementById('reviewText').value.trim();
    const name = document.getElementById('reviewerName').value.trim();
    const email = document.getElementById('reviewerEmail').value.trim();
    const status = document.getElementById('reviewStatus');
    
    if (!rating) {
      showReviewStatus('Please select a rating', 'error');
      return;
    }
    
    if (!text) {
      showReviewStatus('Please write your review', 'error');
      return;
    }
    
    if (!name) {
      showReviewStatus('Please enter your name', 'error');
      return;
    }
    
    if (!email) {
      showReviewStatus('Please enter your email', 'error');
      return;
    }
    
    const review = {
      name: name,
      email: email,
      rating: parseInt(rating.value),
      text: text
    };
    
    saveReview(review);
    
    // Reset form
    form.reset();
    showReviewStatus('✅ Thank you for your review! It has been posted.', 'success');
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  });
}

function showReviewStatus(message, type) {
  const status = document.getElementById('reviewStatus');
  status.textContent = message;
  status.style.display = 'block';
  status.style.backgroundColor = type === 'error' ? '#ffe6e5' : '#e6f4ea';
  status.style.color = type === 'error' ? '#c93a3a' : '#2b6e3c';
  status.style.border = `1px solid ${type === 'error' ? '#c93a3a' : '#2b6e3c'}`;
  status.style.padding = '12px';
  status.style.borderRadius = '12px';
  status.style.marginTop = '1rem';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initReviews();
  initReviewForm();
});
