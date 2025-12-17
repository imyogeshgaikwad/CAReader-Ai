// AI Features for listing creation and editing

// Generate description
async function generateDescription() {
  const titleInput = document.querySelector('input[name="listing[title]"]');
  const locationInput = document.querySelector('input[name="listing[location]"]');
  const countryInput = document.querySelector('input[name="listing[country]"]');
  const priceInput = document.querySelector('input[name="listing[price]"]');
  const descriptionTextarea = document.querySelector('textarea[name="listing[description]"]');
  
  if (!titleInput || !locationInput || !countryInput || !descriptionTextarea) {
    alert('Please fill in the basic details first (title, location, country)');
    return;
  }

  const generateBtn = document.getElementById('generate-description-btn');
  const originalText = generateBtn ? generateBtn.textContent : '';
  
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span>Generating...</span> ✨';
  }

  try {
    const response = await fetch('/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: titleInput.value,
        location: locationInput.value,
        country: countryInput.value,
        price: priceInput ? priceInput.value : 100,
        amenities: [] // You can add amenities input if needed
      })
    });

    const data = await response.json();

    if (data.success) {
      descriptionTextarea.value = data.description;
      showNotification('Description generated successfully! ✨', 'success');
    } else {
      showNotification('Failed to generate description. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.textContent = originalText;
    }
  }
}

// Enhance existing description
async function enhanceDescription() {
  const descriptionTextarea = document.querySelector('textarea[name="listing[description]"]');
  
  if (!descriptionTextarea || !descriptionTextarea.value.trim()) {
    alert('Please enter a description first to enhance it');
    return;
  }

  const enhanceBtn = document.getElementById('enhance-description-btn');
  const originalText = enhanceBtn ? enhanceBtn.textContent : '';
  
  if (enhanceBtn) {
    enhanceBtn.disabled = true;
    enhanceBtn.innerHTML = '<span>Enhancing...</span> ✨';
  }

  try {
    const response = await fetch('/api/ai/enhance-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: descriptionTextarea.value
      })
    });

    const data = await response.json();

    if (data.success) {
      descriptionTextarea.value = data.description;
      showNotification('Description enhanced successfully! ✨', 'success');
    } else {
      showNotification('Failed to enhance description. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    if (enhanceBtn) {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = originalText;
    }
  }
}

// Generate title suggestions
async function generateTitles() {
  const locationInput = document.querySelector('input[name="listing[location]"]');
  
  if (!locationInput || !locationInput.value.trim()) {
    alert('Please enter a location first');
    return;
  }

  const generateTitlesBtn = document.getElementById('generate-titles-btn');
  const originalText = generateTitlesBtn ? generateTitlesBtn.textContent : '';
  
  if (generateTitlesBtn) {
    generateTitlesBtn.disabled = true;
    generateTitlesBtn.textContent = 'Generating...';
  }

  try {
    const response = await fetch('/api/ai/generate-titles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location: locationInput.value,
        propertyType: 'accommodation'
      })
    });

    const data = await response.json();

    if (data.success && data.titles) {
      showTitleSuggestions(data.titles);
    } else {
      showNotification('Failed to generate titles. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    if (generateTitlesBtn) {
      generateTitlesBtn.disabled = false;
      generateTitlesBtn.textContent = originalText;
    }
  }
}

// Show title suggestions modal
function showTitleSuggestions(titles) {
  const modal = document.createElement('div');
  modal.className = 'ai-modal';
  modal.innerHTML = `
    <div class="ai-modal-content">
      <div class="ai-modal-header">
        <h3>✨ AI-Generated Title Suggestions</h3>
        <button class="ai-modal-close" onclick="this.closest('.ai-modal').remove()">×</button>
      </div>
      <div class="ai-modal-body">
        <p>Click on a title to use it:</p>
        <div class="title-suggestions">
          ${titles.map((title, i) => `
            <div class="title-suggestion" onclick="selectTitle('${title.replace(/'/g, "\\'")}')">
              <span class="title-number">${i + 1}</span>
              <span class="title-text">${title}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add styles if not already present
  if (!document.getElementById('ai-modal-styles')) {
    const styles = document.createElement('style');
    styles.id = 'ai-modal-styles';
    styles.textContent = `
      .ai-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .ai-modal-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        animation: slideUp 0.3s;
      }
      
      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .ai-modal-header {
        padding: 20px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .ai-modal-header h3 {
        margin: 0;
        color: #333;
      }
      
      .ai-modal-close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #6c757d;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }
      
      .ai-modal-close:hover {
        background: #f8f9fa;
      }
      
      .ai-modal-body {
        padding: 20px;
        overflow-y: auto;
        max-height: calc(80vh - 80px);
      }
      
      .title-suggestions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;
      }
      
      .title-suggestion {
        padding: 16px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.2s;
      }
      
      .title-suggestion:hover {
        border-color: #667eea;
        background: #f8f9ff;
        transform: translateX(4px);
      }
      
      .title-number {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
      
      .title-text {
        color: #333;
        font-size: 15px;
      }
    `;
    document.head.appendChild(styles);
  }
}

// Select a title
function selectTitle(title) {
  const titleInput = document.querySelector('input[name="listing[title]"]');
  if (titleInput) {
    titleInput.value = title;
    showNotification('Title selected! ✨', 'success');
  }
  document.querySelector('.ai-modal').remove();
}

// Predict optimal price
async function predictPrice() {
  const locationInput = document.querySelector('input[name="listing[location]"]');
  const countryInput = document.querySelector('input[name="listing[country]"]');
  const priceInput = document.querySelector('input[name="listing[price]"]');
  
  if (!locationInput || !countryInput || !locationInput.value.trim() || !countryInput.value.trim()) {
    alert('Please enter location and country first');
    return;
  }

  const predictBtn = document.getElementById('predict-price-btn');
  const originalText = predictBtn ? predictBtn.textContent : '';
  
  if (predictBtn) {
    predictBtn.disabled = true;
    predictBtn.textContent = 'Analyzing...';
  }

  try {
    const response = await fetch('/api/ai/predict-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location: locationInput.value,
        country: countryInput.value,
        currentPrice: priceInput ? priceInput.value : undefined
      })
    });

    const data = await response.json();

    if (data.success) {
      showPricePrediction(data.prediction);
    } else {
      showNotification('Failed to predict price. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    if (predictBtn) {
      predictBtn.disabled = false;
      predictBtn.textContent = originalText;
    }
  }
}

// Show price prediction modal
function showPricePrediction(prediction) {
  const modal = document.createElement('div');
  modal.className = 'ai-modal';
  modal.innerHTML = `
    <div class="ai-modal-content">
      <div class="ai-modal-header">
        <h3>💰 AI Price Recommendation</h3>
        <button class="ai-modal-close" onclick="this.closest('.ai-modal').remove()">×</button>
      </div>
      <div class="ai-modal-body">
        <div class="price-prediction">
          <div class="recommended-price">
            <span class="label">Recommended Price:</span>
            <span class="price">$${prediction.suggested_price}</span>
            <span class="per-night">per night</span>
          </div>
          
          <div class="price-range">
            <span class="label">Suggested Range:</span>
            <span class="range">$${prediction.price_range.min} - $${prediction.price_range.max}</span>
          </div>
          
          <div class="confidence">
            <span class="label">Confidence Level:</span>
            <span class="badge badge-${prediction.confidence}">${prediction.confidence}</span>
          </div>
          
          <div class="reasoning">
            <h4>Analysis:</h4>
            <p>${prediction.reasoning}</p>
          </div>
          
          ${prediction.recommendations && prediction.recommendations.length > 0 ? `
            <div class="recommendations">
              <h4>Recommendations:</h4>
              <ul>
                ${prediction.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <button class="btn-apply-price" onclick="applyPrice(${prediction.suggested_price})">
            Apply This Price
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add additional styles for price prediction
  const styles = document.createElement('style');
  styles.textContent = `
    .price-prediction {
      padding: 16px;
    }
    
    .recommended-price {
      text-align: center;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    
    .recommended-price .label {
      display: block;
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    
    .recommended-price .price {
      display: block;
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .recommended-price .per-night {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .price-range, .confidence {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .label {
      font-weight: 600;
      color: #495057;
    }
    
    .range {
      color: #667eea;
      font-weight: bold;
    }
    
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .badge-high {
      background: #d4edda;
      color: #155724;
    }
    
    .badge-medium {
      background: #fff3cd;
      color: #856404;
    }
    
    .badge-low {
      background: #f8d7da;
      color: #721c24;
    }
    
    .reasoning, .recommendations {
      margin-top: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .reasoning h4, .recommendations h4 {
      margin-top: 0;
      color: #333;
    }
    
    .recommendations ul {
      margin: 8px 0 0;
      padding-left: 20px;
    }
    
    .recommendations li {
      margin: 8px 0;
      color: #495057;
    }
    
    .btn-apply-price {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
      transition: transform 0.2s;
    }
    
    .btn-apply-price:hover {
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(styles);
}

// Apply predicted price
function applyPrice(price) {
  const priceInput = document.querySelector('input[name="listing[price]"]');
  if (priceInput) {
    priceInput.value = Math.round(price);
    showNotification('Price applied! 💰', 'success');
  }
  document.querySelector('.ai-modal').remove();
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `ai-notification ai-notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Add styles if not present
  if (!document.getElementById('ai-notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'ai-notification-styles';
    styles.textContent = `
      .ai-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10001;
        animation: slideInRight 0.3s, slideOutRight 0.3s 2.7s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      
      .ai-notification-success {
        background: #d4edda;
        color: #155724;
        border-left: 4px solid #28a745;
      }
      
      .ai-notification-error {
        background: #f8d7da;
        color: #721c24;
        border-left: 4px solid #dc3545;
      }
    `;
    document.head.appendChild(styles);
  }
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Make functions globally available
window.generateDescription = generateDescription;
window.enhanceDescription = enhanceDescription;
window.generateTitles = generateTitles;
window.selectTitle = selectTitle;
window.predictPrice = predictPrice;
window.applyPrice = applyPrice;