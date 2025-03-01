import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFQY3GlLIYthBfCweSkFPt-y1OLP9HA5o",
    authDomain: "fleduportal.firebaseapp.com",
    projectId: "fleduportal",
    storageBucket: "fleduportal.firebasestorage.app",
    messagingSenderId: "103377001270",
    appId: "1:103377001270:web:47946b9237f57820c7b197",
    measurementId: "G-LSBLB50H94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up Function
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const firstName = document.getElementById("first-name").value;
    const middleName = document.getElementById("middle-name").value || "";
    const lastName = document.getElementById("last-name").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate phone number using libphonenumber-js
    try {
        const phone = parsePhoneNumber(phoneNumber);
        if (!phone.isValid()) {
            alert("Please enter a valid phone number.");
            return;
        }

        const formattedPhoneNumber = phone.formatInternational();

        // Check if the passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Check if the phone number is already in use
        const usersRef = collection(db, "users");
        const phoneQuery = query(usersRef, where("phoneNumber", "==", formattedPhoneNumber));
        const querySnapshot = await getDocs(phoneQuery);

        if (!querySnapshot.empty) {
            alert("This phone number is already registered. Please use a different one.");
            return;
        }

        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            firstName,
            middleName,
            lastName,
            phoneNumber: formattedPhoneNumber,
            email
        });

        alert("Sign-up successful!");
        window.location.href = "login.html"; // Redirect to login page

    } catch (error) {
        alert(`Error: ${error.message}`);
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
        window.location.href = "dashboard.html"; // Redirect to dashboard page

    } catch (error) {
        alert(`Error: ${error.message}`);
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
            alert(`Error: ${error.message}`);
        }
    }
});
// humberger menu
document.addEventListener("DOMContentLoaded", function () {
    // Remove current page's navigation link from menu
    var currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "" || currentPage === "index.html") {
        var homeLink = document.querySelector(".nav-home");
        if (homeLink) homeLink.remove();
    }

    if (currentPage === "login.html") {
        var loginLink = document.querySelector(".nav-login");
        if (loginLink) loginLink.remove();
    }

    if (currentPage === "signup.html") {
        var signupLink = document.querySelector(".nav-signup");
        if (signupLink) signupLink.remove();
    }

    // Hamburger menu toggle
    var menuButton = document.querySelector(".hamburger-menu");
    var menu = document.getElementById("nav-links");

    if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
            menu.classList.toggle("show");
        });
    }
});

