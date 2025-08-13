# GenSafe (Vanilla) — Quick Deploy Guide

1. Create a Firebase project and Firestore database (Native mode).
2. Replace Firebase config placeholders in `public/index.html` with your project's values.
3. Add a Google Maps JavaScript API key and replace REPLACE_GOOGLE_MAPS_API_KEY in `public/index.html`. Restrict it to your domain when deploying.
4. Place files in a repo with the structure:
   - public/index.html
   - public/manifest.json
   - public/service-worker.js
   - functions/index.js
   - functions/package.json
   - firestore.rules
   - firebase.json

5. Deploy Firestore rules:
   - `firebase deploy --only firestore:rules` (or upload via console)

6. Deploy functions:
   - `cd functions`
   - `npm install`
   - Set env vars:
     ```
     firebase functions:config:set sendgrid.key="YOUR_SENDGRID_KEY" \
       twilio.sid="TWILIO_SID" twilio.token="TWILIO_TOKEN" twilio.from="+123..." \
       alert.email="alerts@your.org" alert.sms="+919XXXXXXXXX"
     ```
   - `firebase deploy --only functions`

7. Deploy hosting:
   - `firebase deploy --only hosting`

8. Test:
   - Open the hosted site, allow location when prompted.
   - Try chat (requires Firestore rules/auth as configured).
   - Submit a report (requires authenticated user if using the provided rules).

Security notes:
- The provided `firestore.rules` require authentication to write reports/chat. For a hackathon/demo you can relax them temporarily, but don't leave open in production.
- Do not commit API keys or secrets to the repository. Use environment variables or restricted API keys.
