import dotenv from "dotenv";
dotenv.config();
export const serviceAccount ={
  "type": "service_account",
  "project_id": "carandbikehub-eefc6",
  "private_key_id": `${process.env.FIREBASE_PRIVATE_KEY_ID}`,
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  
  "client_email": "firebase-adminsdk-fbsvc@carandbikehub-eefc6.iam.gserviceaccount.com",
  "client_id": "108528233760829557327",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40carandbikehub-eefc6.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

console.log(process.env.FIREBASE_PRIVATE_KEY)