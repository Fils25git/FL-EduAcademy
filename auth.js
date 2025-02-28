import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up Function
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("first-name").value;
    const middleName = document.getElementById("middle-name").value || ""; // Optional
    const lastName = document.getElementById("last-name").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            firstName,
            middleName,
            lastName,
            phoneNumber,
            email
        });

        alert("Sign-up successful!");
        window.location.href = "login.html";
    } catch (error) {
        alert(error.message);
    }
});

// Login Function (Supports email or phone number)
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const identifier = document.getElementById("login-identifier").value;
    const password = document.getElementById("login-password").value;

    try {
        if (identifier.includes("@")) {
            // Login with email
            await signInWithEmailAndPassword(auth, identifier, password);
        } else {
            // Login with phone number
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("phoneNumber", "==", identifier));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                await signInWithEmailAndPassword(auth, userData.email, password);
            } else {
                throw new Error("Phone number not found.");
            }
        }

        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } catch (error) {
        alert(error.message);
    }
});

// Password Reset Function
document.getElementById("reset-password")?.addEventListener("click", async () => {
    const email = prompt("Enter your email to receive a password reset link:");
    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent! Check your inbox.");
        } catch (error) {
            alert(error.message);
        }
    }
});
