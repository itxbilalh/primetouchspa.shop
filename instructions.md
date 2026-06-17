# Prime Touch Spa — Deployment Instructions

## Project Structure

```
primetouchspa.shop/
├── index.html            # Home page
├── services.html         # Services page
├── about.html            # About Us page
├── gallery.html          # Gallery page
├── testimonials.html     # Testimonials page
├── contact.html          # Contact page
├── book.html             # Book Now page
├── 404.html              # Custom 404 error page
├── sitemap.xml           # XML sitemap for search engines
├── robots.txt            # Robots file for crawlers
├── google-integration.md # Google Ads tracking docs
├── instructions.md       # This file
├── css/
│   └── styles.css        # Shared styles (glassmorphism theme)
├── js/
│   └── script.js         # Shared JavaScript (component loader, interactions)
└── components/
    ├── header.html       # Header component (navigation)
    └── footer.html       # Footer component
```

---

## Option A: Deploy to cPanel (Recommended)

### Step 1: Prepare the files

Upload the **entire project folder** to your cPanel hosting. You can either:

- **FTP** (using FileZilla, Cyberduck, etc.) — upload all files and folders to `public_html/`
- **cPanel File Manager** — Zip the project folder, upload it via File Manager, then extract into `public_html/`

### Step 2: Upload to public_html

Upload all files so that `index.html` is directly inside `public_html/`:

```
public_html/
├── index.html
├── services.html
├── about.html
├── gallery.html
├── testimonials.html
├── contact.html
├── book.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── css/
├── js/
└── components/
```

### Step 3: Verify

Visit `https://primetouchspa.shop/` in your browser. All pages should load with the header, footer, and glassmorphism styling. Navigation links between pages should work.

---

## Option B: Local Preview (Testing Before Deploy)

Because the website uses JavaScript `fetch()` to load the header and footer, opening the files directly via `file://` in your browser **will not work** — the components won't load.

Instead, use a local web server:

### Using Python (built-in, no install needed)

```bash
# Navigate to the project folder
cd /path/to/primetouchspa.shop

# Start the server
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Start the server
cd /path/to/primetouchspa.shop
http-server
```

Then open `http://localhost:8080`.

### Using VS Code

1. Install the **Live Server** extension
2. Right-click `index.html` → **Open with Live Server**

---

## What Gets Deployed

| File | Purpose |
|------|---------|
| `index.html` | Home page — hero, features, services preview, benefits, testimonials, location, CTA |
| `services.html` | Services detail page — 4 services with benefits, durations, booking buttons |
| `about.html` | About Us — story, core values, feature highlights |
| `gallery.html` | Gallery — filterable grid with categories |
| `testimonials.html` | Testimonials — stats + 9 client reviews |
| `contact.html` | Contact — form, 5 contact info cards, map |
| `book.html` | Book Now — booking form with service selection |
| `css/styles.css` | All styling (dark glassmorphism theme) |
| `js/script.js` | All JavaScript (component loader, nav, forms, animations) |
| `components/header.html` | Site header (logo + navigation) |
| `components/footer.html` | Site footer (links, contact, social) |
| `404.html` | Custom 404 error page (self-contained glassmorphism) |
| `sitemap.xml` | XML sitemap for Google and search engines |
| `robots.txt` | Robots file for crawlers |

---

## Customization Guide

### Changing Contact Info

The business phone number (+92 346 9153944), email, and WhatsApp link appear in multiple places:

- **Components:** `components/header.html`, `components/footer.html`
- **Inline fallbacks:** Each page's header/footer placeholder
- **Forms:** `js/script.js` (contact form mailto + WhatsApp)
- **Schema:** `index.html` (JSON-LD)

Search for `+923469153944` or `info@primetouchspa.shop` across all files and update as needed.

### Changing Styles

All visual styles are in `css/styles.css`. Key variables to customize:

```css
:root {
    --primary: #0f766e;        /* Teal - main brand color */
    --primary-light: #14a89d;  /* Teal light */
    --secondary: #d4af37;      /* Gold - accent color */
    --bg: #0a0f1a;             /* Dark background */
    --glass-blur: blur(16px);  /* Glassmorphism blur strength */
}
```

### Changing Service Details

The 4 massage services are detailed in `services.html`. Each service card has:

- Title
- Description
- Duration
- Benefits list
- Booking buttons

---

## Known Limitations

1. **JS dependency:** The header and footer are loaded dynamically via JavaScript. If a visitor has JavaScript disabled, inline fallback content (business name + phone) will display instead. The main page content will still be visible.
2. **Component fetch:** This website requires a web server (not direct file:// opening) for the JS component loader to work. This is already how all cPanel hosting works.
3. **Form submission:** The contact and booking forms open WhatsApp or the user's email client — they do not send data to a server backend. For a server-side form handler, additional development would be needed.

---

## Quick Checklist

- [ ] Upload all files to `public_html/` via FTP or cPanel File Manager
- [ ] Verify `https://primetouchspa.shop/` loads correctly
- [ ] Test navigation between all 7 pages
- [ ] Verify floating WhatsApp button opens the correct chat
- [ ] Verify phone numbers link correctly (click-to-call on mobile)
- [ ] Test sticky mobile bar at the bottom of the page (on mobile)
- [ ] Replace the map placeholder with a real Google Maps embed (optional)
- [ ] In cPanel, set the custom 404 error page to `/404.html`
- [ ] Submit `https://primetouchspa.shop/sitemap.xml` to Google Search Console
- [ ] Verify Google Ads conversion tracking fires on phone and WhatsApp clicks (see `google-integration.md`)
