# OGG Grabber

A lightweight, single-page web application that extracts Open Graph images from any website URL. Built with pure HTML, CSS, and JavaScript - no frameworks or backend required.

## Features

- **Clean, Minimal Interface**: Inspired by macOS Tiger design with subtle gradients, rounded corners, and refined typography
- **Client-Side Only**: All functionality runs in the browser - no server required
- **Fast & Lightweight**: Minimal dependencies, optimized for speed
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + K` to focus the search input
  - `Enter` to submit the form
- **Image Download**: One-click download of extracted OG images
- **Error Handling**: Graceful handling of invalid URLs and missing OG images

## How It Works

1. **URL Input**: Users enter any website URL in the search bar
2. **CORS Proxy**: The app uses a public CORS proxy to fetch the target website's HTML
3. **OG Parsing**: JavaScript parses the HTML to extract Open Graph meta tags
4. **Image Display**: The OG image is displayed with download functionality

## Usage

1. Open `index.html` in any modern web browser
2. Enter a website URL (e.g., `https://example.com`)
3. Click "Extract" or press Enter
4. View the extracted Open Graph image
5. Click the download button to save the image

## Technical Details

### CORS Handling
Due to browser CORS restrictions, the app uses a public CORS proxy service (`api.allorigins.win`) to fetch website content. This allows client-side JavaScript to access external websites.

### OG Image Extraction
The app looks for Open Graph meta tags in this order:
- `<meta property="og:image" content="...">`
- `<meta name="og:image" content="...">`

### Browser Compatibility
- Modern browsers with ES6+ support
- Requires CORS proxy for external website access
- Works offline for the UI (requires internet for OG extraction)

## File Structure

```
ogggrabber.com/
├── index.html      # Main HTML file
├── styles.css      # CSS styling with macOS Tiger design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Design Philosophy

The interface is inspired by classic Apple design principles:
- **Clarity**: Clean, uncluttered layout
- **Speed**: Minimal loading times and instant feedback
- **Refinement**: Subtle animations and polished interactions
- **Accessibility**: Keyboard shortcuts and responsive design

## Browser Security Notes

- The app requires a CORS proxy to access external websites
- Some websites may block proxy requests
- Image downloads may be restricted by browser security policies

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using only HTML, CSS & JavaScript 