// Ensure Supabase is loaded before this script runs
const supabase = window.supabase.createClient(
    "https://uppmptshwlagdyswdvko.supabase.co", // Supabase URL
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcG1wdHNod2xhZ2R5c3dkdmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjA3ODMsImV4cCI6MjA1NjM5Njc4M30.rkXVCQoIun-Pff8APEbP98Cm0FvFt_BKRL81UkXl0IE" // Replace with actual key
);

// Sign Up Function
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        await supabase.from("users").insert([ 
            { id: data.user.id, first_name: firstName, last_name: lastName, email }
        ]);

        alert("Sign-up successful!");
        window.location.href = "login.html";

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Login Function
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
    }

    try {
        console.log("Attempting login with:", email); // Debugging log

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        // Check for errors in the response
        if (error) {
            console.error("Error during login:", error.message); // Debugging log
            throw error;
        }

        // If successful
        alert("Login successful!");
        window.location.href = "dashboard.html"; 

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});


// Password Fields
const passwordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordMessage = document.getElementById("password-message");

// Real-time password match check
function checkPasswordMatch() {
    if (passwordInput.value === "" || confirmPasswordInput.value === "") {
        passwordMessage.textContent = "";
        return;
    }
    if (passwordInput.value === confirmPasswordInput.value) {
        passwordMessage.textContent = "✅ Passwords match!";
        passwordMessage.style.color = "green";
    } else {
        passwordMessage.textContent = "❌ Passwords do not match!";
        passwordMessage.style.color = "red";
    }
}

// Attach event listeners to password fields
passwordInput?.addEventListener("input", checkPasswordMatch);
confirmPasswordInput?.addEventListener("input", checkPasswordMatch);

// Password Reset Function
document.getElementById("reset-password")?.addEventListener("click", async () => {
    const email = prompt("Enter your email to receive a password reset link:");
    if (email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw new Error(error.message);

            alert("Password reset email sent! Check your inbox.");
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
});
