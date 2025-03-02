// Ensure Supabase is loaded before this script runs
const supabase = window.supabase.createClient(
    "https://uppmptshwlagdyswdvko.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcG1wdHNod2xhZ2R5c3dkdmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjA3ODMsImV4cCI6MjA1NjM5Njc4M30.rkXVCQoIun-Pff8APEbP98Cm0FvFt_BKRL81UkXl0IE"
);

// Sign-Up Function
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const messageBox = document.getElementById("signup-message");

    if (password !== confirmPassword) {
        messageBox.textContent = "❌ Passwords do not match!";
        messageBox.style.color = "red";
        messageBox.style.display = "block";
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        await supabase.from("users").insert([
            { id: data.user.id, first_name: firstName, last_name: lastName, email }
        ]);

        messageBox.textContent = "✅ Sign-up successful! Please check your email to verify your account.";
        messageBox.style.color = "green";
        messageBox.style.display = "block";

    } catch (error) {
        messageBox.textContent = `❌ Error: ${error.message}`;
        messageBox.style.color = "red";
        messageBox.style.display = "block";
    }
});

// Real-time password match check
const passwordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordMessage = document.getElementById("password-message");

function checkPasswordMatch() {
    if (passwordInput.value === "" || confirmPasswordInput.value === "") {
        passwordMessage.textContent = "";
        passwordMessage.style.display = "none";
        return;
    }
    if (passwordInput.value === confirmPasswordInput.value) {
        passwordMessage.textContent = "✅ Passwords match!";
        passwordMessage.style.color = "green";
        passwordMessage.style.display = "block";
    } else {
        passwordMessage.textContent = "❌ Passwords do not match!";
        passwordMessage.style.color = "red";
        passwordMessage.style.display = "block";
    }
}

// Attach real-time validation to password fields
passwordInput?.addEventListener("input", checkPasswordMatch);
confirmPasswordInput?.addEventListener("input", checkPasswordMatch);

// Login Function
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const messageBox = document.getElementById("login-message");

    if (!email || !password) {
        messageBox.textContent = "❌ Please enter both email and password.";
        messageBox.style.color = "red";
        messageBox.style.display = "block";
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            messageBox.textContent = "❌ Email or password is incorrect.";
            messageBox.style.color = "red";
            messageBox.style.display = "block";
            return;
        }

        messageBox.textContent = "✅ Login successful! Redirecting...";
        messageBox.style.color = "green";
        messageBox.style.display = "block";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);

    } catch (error) {
        messageBox.textContent = `❌ Error: ${error.message}`;
        messageBox.style.color = "red";
        messageBox.style.display = "block";
    }
});

// Password Reset Function
document.getElementById("reset-password-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

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

        messageBox.textContent = "✅ A password reset link has been sent to your inbox. Please check your email.";
        messageBox.style.color = "green";
        messageBox.style.display = "block";

    } catch (error) {
        messageBox.textContent = `❌ Error: ${error.message}`;
        messageBox.style.color = "red";
        messageBox.style.display = "block";
    }
});
