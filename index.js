// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

exports.alertOnDangerReport = functions.firestore.document('reports/{reportId}').onCreate(async (snap) => {
  const data = snap.data();
  if(!data || data.category !== 'danger') return null;

  const SENDGRID_KEY = functions.config().sendgrid?.key;
  const TW_SID = functions.config().twilio?.sid;
  const TW_TOKEN = functions.config().twilio?.token;
  const TW_FROM = functions.config().twilio?.from;
  const ALERT_EMAIL = functions.config().alert?.email;
  const ALERT_SMS = functions.config().alert?.sms;

  const subject = `GenSafe ALERT — danger reported`;
  const body = `Danger reported:\n${data.description||'[no description]'}\nLocation: ${data.location?.lat}, ${data.location?.lng}\nTime: ${data.createdAt?.toDate? data.createdAt.toDate(): data.createdAt}`;

  if(SENDGRID_KEY && ALERT_EMAIL){
    try {
      sgMail.setApiKey(SENDGRID_KEY);
      await sgMail.send({ to: ALERT_EMAIL, from: 'alerts@gensafe.app', subject, text: body });
    } catch(e){ console.error('SendGrid err', e); }
  }
  if(TW_SID && TW_TOKEN && TW_FROM && ALERT_SMS){
    try {
      const client = twilio(TW_SID, TW_TOKEN);
      await client.messages.create({ body: `GenSafe Alert: ${data.description?.slice(0,120) || 'Danger reported'}`, from: TW_FROM, to: ALERT_SMS });
    } catch(e){ console.error('Twilio err', e); }
  }
  return null;
});
