// Ensure Supabase is loaded before this script runs
const supabase = window.supabase.createClient(
    "https://uppmptshwlagdyswdvko.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcG1wdHNod2xhZ2R5c3dkdmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjA3ODMsImV4cCI6MjA1NjM5Njc4M30.rkXVCQoIun-Pff8APEbP98Cm0FvFt_BKRL81UkXl0IE"
);

// =================== SIGN-UP FUNCTION ===================
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const form = document.getElementById("signup-form");
    const messageBox = document.getElementById("signup-message");

    if (password !== confirmPassword) {
        messageBox.textContent = "❌ Passwords do not match!";
        messageBox.style.color = "red";
        messageBox.style.display = "block";
        return;
    }

    try {
        // Check if the user already exists
        const { data: existingUsers, error: checkError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email);

        if (checkError) throw checkError;

        if (existingUsers.length > 0) {
            messageBox.textContent = "❌ This email is already registered. Please log in.";
            messageBox.style.color = "red";
            messageBox.style.display = "block";
            return;
        }

        // Proceed with sign-up if the email is not registered
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        await supabase.from("users").insert([
            { id: data.user.id, first_name: firstName, last_name: lastName, email }
        ]);

        // Hide the form and show success message
        form.style.display = "none";
        messageBox.textContent = "✅ Signing up has been successful! Please check your inbox for the verification link.";
        messageBox.style.color = "green";
        messageBox.style.display = "block";

    } catch (error) {
        messageBox.textContent = `❌ Error: ${error.message}`;
        messageBox.style.color = "red";
        messageBox.style.display = "block";
    }
});

// =================== LOGIN FUNCTION ===================
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const messageBox = document.getElementById("login-message");

    if (!email || !password) {
        messageBox.textContent = "❌ Please fill in both email and password.";
        messageBox.style.color = "red";
        messageBox.style.display = "block";
        return;
    }

    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            messageBox.textContent = "❌ Incorrect email or password.";
            messageBox.style.color = "red";
            messageBox.style.display = "block";
            return;
        }

        window.location.href = "dashboard.html"; // Redirect on success
    } catch (error) {
        messageBox.textContent = `❌ Error: ${error.message}`;
        messageBox.style.color = "red";
        messageBox.style.display = "block";
    }
});

// =================== PASSWORD MATCH CHECK ===================
const passwordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordMessage = document.getElementById("password-message");

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

passwordInput?.addEventListener("input", checkPasswordMatch);
confirmPasswordInput?.addEventListener("input", checkPasswordMatch);

// =================== SHOW/HIDE PASSWORD TOGGLE ===================
document.querySelectorAll(".toggle-password").forEach((toggle) => {
    toggle.addEventListener("click", function () {
        const passwordField = this.previousElementSibling;
        if (passwordField.type === "password") {
            passwordField.type = "text";
            this.textContent = "🙈"; // Hide icon
        } else {
            passwordField.type = "password";
            this.textContent = "👁️"; // Show icon
        }
    });
});

// =================== PASSWORD RESET FUNCTION ===================
document.getElementById("reset-password")?.addEventListener("click", async () => {
    const email = document.getElementById("reset-email").value.trim();
    const messageBox = document.getElementById("reset-message");

    if (!email) {
        messageBox.textContent = "❌ Please enter your email.";
        messageBox.style.color = "red";
        messageBox.style.display = "block";
        return;
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw new Error(error.message);

        messageBox.textContent = "✅ A password reset link has been sent to your email. Please check your inbox.";
        messageBox.style.color = "green";
        messageBox.style.display = "block";
    } catch (error) {
        messageBox.textContent = `❌ Error: ${error.message}`;
        messageBox.style.color = "red";
        messageBox.style.display = "block";
    }
});
