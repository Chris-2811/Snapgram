/* import users from '../../data/index.js';

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://snapgram-685a0.firebaseapp.com',
});

(async () => {
  for (const user of users) {
    try {
      const newUser = await admin.auth().createUser({
        email: user.email,
        emailVerified: false,
        password: user.password,
        displayName: user.name,
        disabled: false,
      });

      console.log(' created new user:', newUser.uid);
    } catch (error) {
      console.log('Error creating new user:', error);
    }
  }
})();
 */
