// AUTH HEADER
function getAuthHeader() {
    return {
        "Authorization": localStorage.getItem("auth")
    };
}

// PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    hideAdminLink();
    setDriverName();
    loadMyJobs();
});

// Hide admin link for drivers
function hideAdminLink() {
    const username = localStorage.getItem("username");

    if (username !== "admin") {
        const adminLink = document.getElementById("adminLink");
        if (adminLink) adminLink.style.display = "none";
    }
}

function renderJobs(jobs) {
    const jobsList = document.getElementById("driverJobsList");
    jobsList.innerHTML = "";

    if (jobs.length === 0) {
        jobsList.innerHTML = "<p>No jobs found</p>";
        return;
    }

    // 🔹 Sort jobs by date
    jobs.sort((a, b) => new Date(a.jobDate) - new Date(b.jobDate));

    let currentDate = "";

    jobs.forEach(job => {

        // DATE HEADER
        if (job.jobDate !== currentDate) {
            currentDate = job.jobDate;

            const dateObj = new Date(currentDate);

            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };

            const dateHeader = document.createElement("h3");
            dateHeader.style.marginTop = "20px";
            dateHeader.style.color = "#2c3e50";

            dateHeader.innerText =
                dateObj.toLocaleDateString('en-NZ', options);

            jobsList.appendChild(dateHeader);
        }

        // FIXED VARIABLES
        const formattedDate = new Date(job.jobDate)
            .toLocaleDateString('en-NZ');

        const status = job.status || "PENDING";

        const statusText =
            status.replace("_", " ");

        const statusClass =
            status === "COMPLETED"
                ? "completed"
                : status === "IN_PROGRESS"
                    ? "in-progress"
                    : "pending";

        // JOB CARD
        const jobDiv = document.createElement("div");
        jobDiv.className = "job-card";

        jobDiv.innerHTML = `
            <div class="job-top-row">
                <span><strong>Job ID:</strong> ${job.id}</span>

                <span>
                    <strong>Route:</strong>
                    ${job.pickupLocation} → ${job.deliveryLocation}
                </span>

                <span><strong>Date:</strong> ${formattedDate}</span>

                <span>
                    <strong>Weight:</strong>
                    ${job.weight || "N/A"} kg
                </span>

                <span>
                    <strong>Truck:</strong>
                    ${job.truckType || "N/A"}
                </span>

                <span>
                    <strong>Status:</strong>

                    <span class="status-badge ${statusClass}">
                        ${statusText}
                    </span>
                </span>
            </div>

            <div class="job-buttons">
                <button onclick="viewJob(${job.id})">
                    View Job
                </button>

                <button onclick="markCompleted(${job.id})">
                    Mark Completed
                </button>
            </div>
        `;

        jobsList.appendChild(jobDiv);
    });
}

//Load ALL jobs (default view)
async function loadMyJobs() {
    try {
        const username = localStorage.getItem("username");

        const res = await fetch("http://localhost:8080/drivers", {
            headers: getAuthHeader()
        });

        const drivers = await res.json();
        const driver = drivers.find(d => d.username === username);

        if (!driver) {
            document.getElementById("driverJobsList").innerHTML = "<p>Driver not found</p>";
            return;
        }

        const response = await fetch(`http://localhost:8080/jobs/driver/${driver.id}`, {
            headers: getAuthHeader()
        });

        const jobs = await response.json();

        renderJobs(jobs); //uses shared UI

    } catch (error) {
        console.error(error);
    }
}

// WEEK FILTER (FIXED VERSION)
async function loadMyJobsByWeek() {
    const selectedDate = document.getElementById("weekStart").value;
    const selectedStatus = document.getElementById("statusFilter").value;

    if (!selectedDate) {
        alert("Please select a date");
        return;
    }

    try {
        const username = localStorage.getItem("username");

        const res = await fetch("http://localhost:8080/drivers", {
            headers: getAuthHeader()
        });

        const drivers = await res.json();
        const driver = drivers.find(d => d.username === username);

        if (!driver) return;

        const response = await fetch(`http://localhost:8080/jobs/driver/${driver.id}`, {
            headers: getAuthHeader()
        });

        const jobs = await response.json();

        const start = new Date(selectedDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        const filtered = jobs.filter(job => {
            if (!job.jobDate) return false;

            const jobDate = new Date(job.jobDate);

            const inWeek = jobDate >= start && jobDate <= end;
            const statusMatch = selectedStatus === "" || job.status === selectedStatus;

            return inWeek && statusMatch;
        });

        renderJobs(filtered);

    } catch (error) {
        console.error(error);
    }
}

// Mark job completed
async function markCompleted(jobId) {
    try {
        const response = await fetch(
            `http://localhost:8080/jobs/${jobId}/status?status=COMPLETED`,
            {
                method: "PUT",
                headers: getAuthHeader()
            }
        );

        if (response.ok) {
            loadMyJobs();
        } else {
            alert("Failed to update job");
        }

    } catch (error) {
        alert("Error updating job");
    }
}

//Add comment
async function addComment(jobId) {
    const comment = document.getElementById(`comment-${jobId}`).value;

    try {
        await fetch(`http://localhost:8080/jobs/${jobId}/comment`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify({ comment })
        });

        loadMyJobs();

    } catch (error) {
        alert("Error saving comment");
    }
}

// Logout
function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
}

async function setDriverName() {
    const username = localStorage.getItem("username");
    const el = document.getElementById("driverName");

    try {
        const res = await fetch("http://localhost:8080/drivers", {
            headers: getAuthHeader()
        });

        const drivers = await res.json();

        const driver = drivers.find(d => d.username === username);

        if (driver) {
            el.innerText = driver.name;
        } else {
            el.innerText = username; // fallback
        }

    } catch (error) {
        console.error(error);
        el.innerText = username;
    }
}

function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");

    window.location.href = "/login.html";
}

function viewJob(jobId) {
    window.location.href =
        `/job.html?id=${jobId}&mode=driver`;
}

function logout() {

    localStorage.removeItem("auth");
    localStorage.removeItem("username");

    window.location.href = "/login.html";
}