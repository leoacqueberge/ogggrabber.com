// DOM elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const pasteBtn = document.getElementById('pasteBtn');
const placeholderCard = document.getElementById('placeholderCard');
const resultCard = document.getElementById('resultCard');
const resultTitle = document.getElementById('resultTitle');
const resultUrl = document.getElementById('resultUrl');
const imageContainer = document.getElementById('imageContainer');
const ogImage = document.getElementById('ogImage');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');

// CORS proxy service (using a public CORS proxy)
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Event listeners
urlForm.addEventListener('submit', handleUrlSubmit);
pasteBtn.addEventListener('click', handlePaste);
downloadBtn.addEventListener('click', handleDownload);

// Handle URL submission
async function handleUrlSubmit(e) {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    if (!url) return;
    
    // Validate URL
    if (!isValidUrl(url)) {
        showError('Please enter a valid URL');
        return;
    }
    
    // Show loading state
    setLoading(true);
    hideResults();
    
    try {
        const ogData = await fetchOGData(url);
        
        if (ogData.image) {
            showSuccess(ogData);
        } else {
            showError('No Open Graph image found for this URL');
        }
    } catch (error) {
        console.error('Error fetching OG data:', error);
        showError('Failed to fetch data. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Fetch OG data from URL
async function fetchOGData(url) {
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    return parseOGData(html, url);
}

// Parse OG data from HTML
function parseOGData(html, originalUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract OG image
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                   doc.querySelector('meta[name="og:image"]')?.getAttribute('content');
    
    // Extract title
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                   doc.querySelector('title')?.textContent ||
                   'Untitled';
    
    // Extract description
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                         '';
    
    return {
        image: ogImage,
        title: ogTitle,
        description: ogDescription,
        url: originalUrl
    };
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Set loading state
function setLoading(loading) {
    if (loading) {
        urlInput.disabled = true;
        urlInput.style.opacity = '0.6';
    } else {
        urlInput.disabled = false;
        urlInput.style.opacity = '1';
    }
}

// Show success result
function showSuccess(data) {
    resultTitle.textContent = data.title;
    
    // Make URL clickable
    resultUrl.innerHTML = `<a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.url}</a>`;
    
    // Set image with error handling
    ogImage.onload = () => {
        imageContainer.style.display = 'block';
        errorMessage.style.display = 'none';
        resultCard.style.display = 'block';
        placeholderCard.style.display = 'none';
    };
    
    ogImage.onerror = () => {
        showError('Failed to load the image');
    };
    
    ogImage.src = data.image;
    
    // Store image URL for download
    downloadBtn.dataset.imageUrl = data.image;
}

// Show error message
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'block';
    imageContainer.style.display = 'none';
    resultCard.style.display = 'block';
    placeholderCard.style.display = 'none';
}

// Hide results
function hideResults() {
    resultCard.style.display = 'none';
    placeholderCard.style.display = 'none';
}

// Handle paste
async function handlePaste() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            urlInput.value = text;
            urlInput.focus();
            // Automatically submit the form after pasting
            urlForm.dispatchEvent(new Event('submit'));
        }
    } catch (error) {
        console.error('Failed to read clipboard:', error);
        // Fallback: try to paste using execCommand
        urlInput.focus();
        document.execCommand('paste');
        // Automatically submit the form after pasting
        setTimeout(() => {
            urlForm.dispatchEvent(new Event('submit'));
        }, 100);
    }
}



// Handle download
function handleDownload() {
    const imageUrl = downloadBtn.dataset.imageUrl;
    if (!imageUrl) return;
    
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'og-image.jpg';
    link.target = '_blank';
    
    // Try to download, fallback to opening in new tab
    try {
        link.click();
    } catch (error) {
        // If download fails, open in new tab
        window.open(imageUrl, '_blank');
    }
}

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input on Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        urlInput.focus();
    }
    
    // Submit on Enter (when input is focused)
    if (e.key === 'Enter' && document.activeElement === urlInput) {
        urlForm.dispatchEvent(new Event('submit'));
    }
});

// Auto-focus input on page load
window.addEventListener('load', () => {
    urlInput.focus();
}); 