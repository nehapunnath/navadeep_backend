// models/AuthModel.js
const { admin } = require('../Config/firebaseAdmin');
const { getAuth, signInWithEmailAndPassword } = require('@firebase/auth');
const { initializeApp } = require('@firebase/app');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_WEB_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const clientApp = initializeApp(firebaseConfig, 'client');
const clientAuth = getAuth(clientApp);

class AuthModel {
  // Verify Firebase ID or Custom Token
  static async verifyToken(token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token, true);
      return { success: true, decodedToken };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if user is admin via custom claims
  static async isAdmin(uid) {
    try {
      const user = await admin.auth().getUser(uid);
      return !!(user.customClaims && user.customClaims.admin);
    } catch (error) {
      return false;
    }
  }

  // MAIN LOGIN FUNCTION (Only this is needed)
  static async login(email, password) {
    try {
      // Step 1: Verify password securely using Client SDK (server-side)
      const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
      const uid = userCredential.user.uid;

      console.log("Password verified for:", email);

      // Optional: Fetch extra user data from Realtime DB / Firestore
      // const snapshot = await admin.database().ref(`users/${uid}`).once('value');
      // const userData = snapshot.val() || {};

      // Step 2: Generate permanent custom token
      const customToken = await admin.auth().createCustomToken(uid);

      // Step 3: Check if admin
      const isAdmin = await this.isAdmin(uid);

      return {
        success: true,
        token: customToken,
        uid,
        isAdmin,
        message: "Login successful"
      };

    } catch (error) {
      console.error("Login failed:", error.code, error.message);

      let message = "Login failed. Please try again.";

      if (error.code === 'auth/user-not-found') message = "No account found with this email.";
      if (error.code === 'auth/wrong-password') message = "Incorrect password.";
      if (error.code === 'auth/invalid-credential') message = "Invalid email or password.";
      if (error.code === 'auth/too-many-requests') message = "Too many attempts. Try again later.";

      return { success: false, error: message };
    }
  }
}

module.exports = AuthModel;