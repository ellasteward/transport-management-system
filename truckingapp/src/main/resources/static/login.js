// Handle login form submission

document
    .getElementById("loginForm")
    .addEventListener("submit", async function(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    // Create HTTP Basic Authentication header
    const authHeader =
        "Basic " + btoa(username + ":" + password);

    try {

        // Check login details against backend
        const res = await fetch(
            "http://localhost:8080/jobs",
            {
                headers: {
                    "Authorization": authHeader
                }
            }
        );

        if (res.ok) {

            // Store auth information
            localStorage.setItem(
                "auth",
                authHeader
            );

            localStorage.setItem(
                "username",
                username
            );

            // Redirect based on role
            if (
                username === "admin" ||
                username.toLowerCase().includes("dispatch")
            ) {

                window.location.href =
                    "admin.html";

            } else {

                window.location.href =
                    "driver.html";
            }

        } else {

            document.getElementById("error")
                .innerText =
                "Invalid username or password";
        }

    } catch (err) {

        document.getElementById("error")
            .innerText =
            "Server not running";
    }

});