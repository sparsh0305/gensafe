GENSAFE — Quick Deploy (Hackathon)

1) Prepare folder
  public/
    index.html
    manifest.json
    service-worker.js
    icons/icon-192.png
    icons/icon-512.png

2) Replace placeholders:
  - In index.html: REPLACE_GOOGLE_MAPS_API_KEY
  - In index.html firebaseConfig: REPLACE_FIREBASE_...
  - If using Cloud Functions: set env vars for sendgrid/twilio

3) Create a Firebase project:
  - Enable Firestore (Native mode)
  - Optionally, enable Functions & set env with firebase functions:config:set sendgrid.key="..." twilio.sid="..." twilio.token="..." twilio.from="+..." alert.email="..." alert.sms="+..."

4) Deploy Firestore rules:
  - Save firestore.rules then deploy: `firebase deploy --only firestore:rules`

5) (Optional) Deploy functions
  - cd functions && npm install
  - firebase deploy --only functions

6) Deploy hosting (GitHub Pages or Firebase Hosting)
  Option A — GitHub Pages:
    - Push repo with `public/` content to GitHub
    - In repo settings -> Pages -> deploy branch: `main`, folder: `/` or `/docs`
  Option B — Firebase Hosting:
    - `firebase init hosting` (select public folder `public`)
    - `firebase deploy --only hosting`

7) Test:
  - Open site, allow location when prompted.
  - Click SOS, Send a chat message, Submit a report.
  - Check Firestore console for chat & reports.

Security notes:
- Firestore rules require auth (anonymous sign in enabled by the app).
- Do not commit production API keys in public repos; restrict Google Maps key to your domain.
