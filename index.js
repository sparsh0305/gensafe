const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

exports.alertOnDangerReport = functions.firestore.document('reports/{reportId}').onCreate(async (snap, ctx) => {
  const data = snap.data();
  if(!data) return null;
  if(data.category !== 'danger') return null; // only alert on danger

  // Load config
  const SENDGRID_API_KEY = functions.config().sendgrid?.key;
  const TWILIO_SID = functions.config().twilio?.sid;
  const TWILIO_TOKEN = functions.config().twilio?.token;
  const TWILIO_FROM = functions.config().twilio?.from;
  const ALERT_EMAIL = functions.config().alert?.email;
  const ALERT_SMS = functions.config().alert?.sms;

  // Compose message
  const subject = `GenSafe Alert — danger reported`;
  const bodyText = `A danger incident was reported:\n\nCategory: ${data.category}\nDescription: ${data.description || '[no description]'}\nLocation: ${data.location?.lat}, ${data.location?.lng}\nReport ID: ${snap.id}\nTime: ${data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt}`;

  // Send Email via SendGrid
  if(SENDGRID_API_KEY && ALERT_EMAIL){
    try{
      sgMail.setApiKey(SENDGRID_API_KEY);
      const msg = {
        to: ALERT_EMAIL,
        from: 'alerts@gensafe.app',
        subject: subject,
        text: bodyText
      };
      await sgMail.send(msg);
      console.log('Alert email sent');
    }catch(e){console.error('SendGrid error', e)}
  }

  // Send SMS via Twilio
  if(TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM && ALERT_SMS){
    try{
      const client = twilio(TWILIO_SID, TWILIO_TOKEN);
      await client.messages.create({body: `GenSafe Alert: ${data.description?.slice(0,120) || 'Danger reported'}`, from: TWILIO_FROM, to: ALERT_SMS});
      console.log('Alert SMS sent');
    }catch(e){console.error('Twilio error', e)}
  }

  return null;
});
