import { createClient } from '@supabase/supabase-js'
import { parsePhoneNumber } from "https://cdn.jsdelivr.net/npm/libphonenumber-js@1.9.47/bundle/libphonenumber-min.js";

// Supabase configuration
const supabaseUrl = 'https://uppmptshwlagdyswdvko.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcG1wdHNod2xhZ2R5c3dkdmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjA3ODMsImV4cCI6MjA1NjM5Njc4M30.rkXVCQoIun-Pff8APEbP98Cm0FvFt_BKRL81UkXl0IE'  // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey)

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

    try {
        // Validate and format phone number using libphonenumber-js
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

        // Create the user in Supabase Authentication
        const { user, error: signUpError } = await supabase.auth.signUp({
            email,
            password
        });

        if (signUpError) {
            throw new Error(signUpError.message);
        }

        // Store additional user details in Supabase Database
        await supabase.from("users").insert([{
            id: user.id,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            phone_number: formattedPhoneNumber,
            email
        }]);

        alert("Sign-up successful!");
        window.location.href = "login.html"; // Redirect to login page

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Login Function (Supports email or phone number)
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    let identifier = document.getElementById("login-identifier").value;
    const password = document.getElementById("login-password").value;

    try {
        // Login with email
        if (identifier.includes("@")) {
            const { user, error } = await supabase.auth.signInWithPassword({
                email: identifier,
                password
            });

            if (error) {
                throw new Error(error.message);
            }

            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to dashboard page

        } else {
            // Format phone number and query for user email
            const phone = parsePhoneNumber(identifier);
            identifier = phone.formatInternational();
            
            const { data, error } = await supabase
                .from("users")
                .select("email")
                .eq("phone_number", identifier)
                .single();

            if (error) {
                throw new Error("Phone number not found.");
            }

            const { user, signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password
            });

            if (signInError) {
                throw new Error(signInError.message);
            }

            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to dashboard page
        }

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Password Reset Function
document.getElementById("reset-password")?.addEventListener("click", async () => {
    const email = prompt("Enter your email to receive a password reset link:");
    if (email) {
        try {
            const { error } = await supabase.auth.api.resetPasswordForEmail(email);
            if (error) {
                throw new Error(error.message);
            }
            alert("Password reset email sent! Check your inbox.");
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
});
