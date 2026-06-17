# Google Integration: Goals Tracking for Prime Touch Spa

This file documents the recommended Google Ads setup for tracking two website goals:

- Phone call clicks
- WhatsApp message clicks

The website is a static HTML site with shared JavaScript in [`js/script.js`](./js/script.js). The cleanest implementation is to add a Google tag on every page and fire conversion events from the existing `tel:` and WhatsApp links.

## What to Track

Track these user actions as separate conversion goals:

1. `Call Click`
   - Fires when a visitor clicks any phone link on the site.
   - Targets links like `tel:+923469153944`.

2. `WhatsApp Click`
   - Fires when a visitor clicks any WhatsApp link on the site.
   - Targets links like `https://wa.me/923469153944`.

## Recommended Setup

Use Google Ads conversion actions, not only Analytics events.

Suggested conversion actions in Google Ads:

- `Call Click - Website`
- `WhatsApp Click - Website`

If the business wants source-level reporting later, these can also be mirrored into GA4. For now, Google Ads conversion actions are enough for bidding and goals.

### Exact Google Ads Tag From Email

The shared Google Ads tag in the email is:

- Conversion ID: `AW-18223468176`
- Google tag ID: `GT-TBZ33P99`
- Existing event snippet label for the phone conversion: `W_LPCJWk7r8cEJCd0PFD`

This email confirms the account is already issuing a valid Google Ads conversion tag, so the site should use this exact ID for the global site tag.

### Current Google Tag Popup State

I checked the live `Manage Google tag` popup in Google Ads. It shows:

- Tag name: `F7 Spa`
- Tag IDs: `AW-18223468176` and `GT-TBZ33P99`
- Destination: `F7 Spa`
- Destination ID: `AW-18223468176`
- `Ignore duplicate instances of on-page configuration (recommended)` is enabled

The account still shows an `URGENT` status on the Google tag card, so the account connection exists but still needs verification and cleanup before bidding should rely on it.

### Newly Created WhatsApp Conversion

I created a new Google Ads conversion action for WhatsApp clicks:

- Conversion name: `WhatsApp Click - Website`
- Category: `Contact`
- Measurement type: click-based event snippet
- Conversion label: `AW-18223468176/o7h5CMjI8MAcEJCd0PFD`

Google Ads also created an additional generic `Contact` conversion action during the same flow. The developer should treat `WhatsApp Click - Website` as the one to wire into the site for WhatsApp button/link clicks.

## Current Google Ads State

Based on the live Google Ads goals page:

- `Phone call lead` already exists as a `Primary` website conversion action, but it is currently `Inactive` and marked `Misconfigured` in the Goals summary.
- `Contact` is `Active`.
- `Get directions` is `Needs attention`.
- `Engagement` is `Active`.
- `Page view` is `Active`.

That means the website code should be treated as an implementation for:

- fixing the existing call conversion tracking
- adding a new WhatsApp conversion action and tracking for the first time

## Implementation Plan

### 1) Add the Google tag to every page

Place the Google tag in the `<head>` of every HTML file:

- `index.html`
- `services.html`
- `about.html`
- `gallery.html`
- `testimonials.html`
- `contact.html`
- `book.html`

If the site is later refactored to use a shared server-side layout, the tag can move into the shared head include. Do not rely on `components/header.html` for the Google tag because that file is injected after page load and is too late for page-level tracking.

### 2) Add click listeners in `js/script.js`

Use a single helper that tracks:

- all `a[href^="tel:"]` links
- all `a[href*="wa.me/"]` links

This site already has phone and WhatsApp links in:

- hero section on `index.html`
- contact page action cards
- footer fallback
- floating WhatsApp button
- mobile sticky bar

Centralizing the listener in `js/script.js` prevents missing any future link.

### 3) Fire Google Ads conversion events

Use the Google Ads conversion IDs and labels that are created in the Ads account.

Example event calls:

```html
<script>
  gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXX/CALL_LABEL',
    'value': 1.0,
    'currency': 'PKR'
  });

  gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXX/WHATSAPP_LABEL',
    'value': 1.0,
    'currency': 'PKR'
  });
</script>
```

Replace:

- `AW-XXXXXXX` with the Google Ads conversion ID
- `CALL_LABEL` with the phone click conversion label
- `WHATSAPP_LABEL` with the WhatsApp click conversion label

For the current account, the developer should confirm the real Google Ads conversion label for the existing `Phone call lead` action before wiring it, because the live account shows it as misconfigured and inactive.

The developer should also confirm whether the account is using the Google tag ID `GT-TBZ33P99` in addition to the Ads conversion ID. That tag is present in the live popup and should be considered part of the implementation.

For this account, the email already provides the call conversion snippet:

```html
<script>
  gtag('event', 'conversion', {'send_to': 'AW-18223468176/W_LPCJWk7r8cEJCd0PFD'});
</script>
```

That snippet is for the phone conversion event. If WhatsApp tracking is added as a separate conversion action, it will need its own distinct label from Google Ads.

## Suggested JavaScript Pattern

Add this to `js/script.js` after the existing form handlers:

```javascript
function initGoogleAdsGoals() {
    const callLinks = document.querySelectorAll('a[href^="tel:"]');
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me/"]');

    function trackGoogleAdsConversion(sendTo) {
        if (typeof window.gtag !== 'function') return;

        window.gtag('event', 'conversion', {
            send_to: sendTo,
            value: 1.0,
            currency: 'PKR'
        });
    }

    callLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            trackGoogleAdsConversion('AW-XXXXXXX/CALL_LABEL');
        });
    });

    whatsappLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            trackGoogleAdsConversion('AW-XXXXXXX/WHATSAPP_LABEL');
        });
    });
}
```

Then call it from `DOMContentLoaded`:

```javascript
initGoogleAdsGoals();
```

### Important note for WhatsApp links

Most WhatsApp links open a new tab. That is fine, but the conversion event should still fire before the browser leaves the page. If a future browser blocks the event because the tab changes too quickly, keep the link opening in a new tab and avoid immediate redirects in the same tab.

## Recommended Page Targets

The highest-value tracking points on this site are:

- `Call Now` buttons
- `WhatsApp Now` buttons
- Floating WhatsApp button
- Mobile sticky call / WhatsApp bar
- Contact page phone and WhatsApp cards

## Google Ads Goals Guidance

For local service campaigns, these should usually be marked as primary conversions:

- Phone call clicks
- WhatsApp clicks

Optional secondary conversions:

- Contact form submit
- Book online submit

If the account uses bidding based on conversions, keep the lead actions as primary and make low-value actions secondary.

If `Get directions` is not a business goal, consider making it secondary or removing it from bidding so it does not distort optimization.

## Testing Checklist

After implementation, verify:

- Clicking a phone link triggers the call conversion
- Clicking a WhatsApp link triggers the WhatsApp conversion
- The conversion events fire on:
  - home page
  - contact page
  - footer
  - mobile sticky bar
- The site still works without JavaScript

## Notes for This Codebase

- This site already uses shared HTML fragments for header/footer content, but the tracking scripts should live in the page `<head>` and in `js/script.js`.
- Phone number used across the site is `+92 346 9153944` / `+923469153944`.
- WhatsApp number used across the site is `+923469153944`.

## Implementation Status

The following has been implemented:

- [x] Google tag (`AW-18223468176`) added to `<head>` of all 7 HTML pages
- [x] Call conversion tracking fires on all `tel:` link clicks using label `W_LPCJWk7r8cEJCd0PFD`
- [x] WhatsApp conversion tracking fires on all `wa.me/` link clicks using label `o7h5CMjI8MAcEJCd0PFD`
- [x] Centralized click listeners in `js/script.js` via `initGoogleAdsGoals()`

## Remaining Steps

- [ ] Verify the `Phone call lead` conversion in Google Ads is no longer `Misconfigured` / `Inactive`
- [ ] Resolve the `URGENT` status on the Google tag card in Google Ads
- [ ] Mark `Get directions` as secondary or remove it from bidding if it is not a business goal
- [ ] Test the tracking end-to-end: click phone and WhatsApp links, verify conversions appear in Google Ads within 24-48 hours
