import dotenv from "dotenv";
dotenv.config();
export const serviceAccount ={
  "type": "service_account",
  "project_id": process.env.PROJECT_ID,
  "private_key_id": `${process.env.FIREBASE_PRIVATE_KEY_ID}`,
  // "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDXvs2f0n7MnuYS\nSP5tv+D4KMESMpBye4g91e+B9fiL+MkAGcVV7G9czQ5GUD3SBD36j3/3HBc9c8ga\nRCpdt8k4BqBlPKJh36EFiY9OTJ4acmp8TLTaeriX+PBt1vwSpwo8sF7DIlfkntMZ\ndAUo+Cgmhrw/MHbSOC1cSDJ7uRSAwjmEKAWPCJo66ueiNQvsaxs4m8ZPzAsd0PC3\nyVbnQJloA0LI9zNkz5SZ+4UL1qM2zdELdZbK5pHdfUFxSem5oai/FlFxQhkNv+JV\n1285IYgtxpIkU29sODTjPbbhl1DkgdeBaPry/VClDdGfIvduP6dLIoNzY+jeyXmW\nGzO2PpDHAgMBAAECggEACbqhm4eDljU1wINzm5NIgu2xVeF3vxnlWRwRnIkby2c4\nMavpng9FS3aoBb+ZYE7Exr6J/89d+9Dzi73oMaHXsby0/DLag/1F+HjmTqjlS6jM\nb76mdW6ppyd1HCxEb+VXReV1/BOEWCnLYq9Kw5x75iTeFZFnbP4Bbv2/mX/w4Jaa\nnaFTRTMAhh5A9y2n1xgKMDdHGBgL3DRnwBKiLK1FwmhZ9s9PeWPxR3LpvJVU5SGh\n79vDtbOm/eVn1ZC/6XiSX+r04vrbbJxroyFUpw2vnUB1fqOXLhc/7a57OGi2tUU7\nUyDW5ANgfOJ3ZAtEoRHX2o2yMWJBx5Fy2LHd2lUviQKBgQD7GdHC+eV+vCmolNcM\nhbQ7n8xkMpvQjIBoumkWGRbzqoQQjo8RyXCo9gDHYPRa9Wd6qn0gnbMrLwZxDmpB\nmkbno8/ptp5LRIpy0waq+9uKcyqKowfgsQTiwsqy+grSdWd8TvzsZ+5Qs63B+3V4\nQ3sSvu9rXWR6CdxUjGsa3tPFXwKBgQDb9GR+blh8QVrPKFvHD64Jo5tl4i/hpy7I\nGKhJS9S2BOHvvero63vLRdWN+lktRXMGvt/yWLOVg/OWLxdBVPSQZHwX/qZ2twbh\nDsPKy0so0aFIQXZTYT7SDuC0qj2xIgoGULYAQPleTwbOuurAgNfWCtrkYqDfGnub\nFyYPyWVFmQKBgDcL1vc2T0A0QbGqR2aAXR2BD46bpZrXYkMTMnxcrbJnHCKBDg4p\nKeBwZYVP1OGn0LKMc3fV+nQqD/By54pQJuEbATZMCXGYqf04E8siAWPdkWLpEI4K\nYHbRmxwXQo4WnMQckMfGlPDuItZWqM7fhDh80QGpbKBwTvPeAJDYbnZjAoGATJ5U\nR0pO3nGxnUnUtoG6wTbRker5fORMwnz8WhPlM8Z9oZKJertUsxlPa5aSa9euWuIw\nhm3pmKKPPniG5EYgrw+hvoYBHIdjCRComUK5mq1zPgU3n5HXXTq7gZNvy/0sesiw\nrWP0uapTl726unXnOXMsjrPgj/bcqcilhIhGE7kCgYB0YK6GnIe8aS1HquRZiGay\nKcaoCmtp4AM2lp5DKwTxR179qoPw7yDW1mvmNWehbSjX7hdcLT1pk6+pLu+fT1LJ\nx0TfV/aXZNJKwdAj8wazdNJwTuMldjMrcsLFk5OGBz/OztfIv8OFJrDEqUFFZets\n/8fLEj/pgRJ8HYqEHbP4EA==\n-----END PRIVATE KEY-----\n",
  
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40carandbikehub-eefc6.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
} 