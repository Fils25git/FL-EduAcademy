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
