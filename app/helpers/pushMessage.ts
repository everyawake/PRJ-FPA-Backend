import firebaseAdmin from "firebase-admin";

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: "finger-print-authenticate",
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

export function pushAuthRequestMessage(
  targetToken: string,
  thirdPartyName: string,
  socketId: string
) {
  const message: firebaseAdmin.messaging.Message = {
    notification: {
      title: "인증 요청",
      body: `[${thirdPartyName}]에서 인증을 요청했습니다`
    },
    data: {
      page: "AUTH_REQUEST",
      thirdPartyName,
      socketId
    },
    token: targetToken
  };

  firebaseAdmin
    .messaging()
    .send(message)
    .then(res => {
      console.log(`Successfully GCM send: ${res}`);
    })
    .catch(err => {
      console.log(`Failed GCM send: ${err}`);
    });
}
