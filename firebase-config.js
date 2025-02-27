import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFQY3GlLIYthBfCweSkFPt-y1OLP9HA5o",
        authDomain: "fleduportal.firebaseapp.com",
            projectId: "fleduportal",
                storageBucket: "fleduportal.appspot.com",
                    messagingSenderId: "103377001270",
                        appId: "1:103377001270:web:47946b9237f57820c7b197",
                            measurementId: "G-LSBLB50H94"
                            };

                            const app = initializeApp(firebaseConfig);
                            const auth = getAuth(app);
                            const db = getFirestore(app);
                            const storage = getStorage(app);

                            export { auth, db, storage };
                            