function getAuthHeader() {
    return {
        "Authorization": "Basic " + btoa("admin:admin123")
    };
}

document.addEventListener("DOMContentLoaded", () => {
    loadDriversDropdown();
});

async function loadDriversDropdown() {
    try {
        const res = await fetch("http://localhost:8080/drivers", {
            headers: getAuthHeader()
        });

        const drivers = await res.json();

        const select = document.getElementById("driverId");
        select.innerHTML = "<option value=''>Select Driver</option>";

        drivers.forEach(d => {
            const option = document.createElement("option");
            option.value = d.id;
            option.textContent = `ID: ${d.id} - ${d.name} (${d.truckType || "No type"})`;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading drivers:", error);
    }
}

async function loadDriverJobs() {
    const driverId = document.getElementById("driverId").value;
    const jobsList = document.getElementById("driverJobsList");

    jobsList.innerHTML = "";

    if (!driverId) {
        jobsList.innerHTML = "<p class='error'>Please select a driver</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/jobs/driver/${driverId}`, {
            headers: getAuthHeader()
        });

        if (!response.ok) {
            jobsList.innerHTML = "<p class='error'>Could not load jobs</p>";
            return;
        }

        const jobs = await response.json();

        if (jobs.length === 0) {
            jobsList.innerHTML = "<p>No jobs assigned</p>";
            return;
        }

        jobs.forEach(job => {
            const jobDiv = document.createElement("div");
            jobDiv.className = "job-card";

            jobDiv.innerHTML = `
                <p><strong>Job ID:</strong> ${job.id}</p>
                <p><strong>Route:</strong> ${job.pickupLocation} → ${job.deliveryLocation}</p>
                <p><strong>Date:</strong> ${job.jobDate || "N/A"}</p>
                <p><strong>Weight:</strong> ${job.weight || "N/A"} kg</p>
                <p><strong>Truck:</strong> ${job.truckType || "N/A"}</p>
<p>
    <strong>Status:</strong>
    <span class="status-badge ${job.status === "COMPLETED" ? "completed" : "pending"}">
        ${job.status}
    </span>
</p>

<span class="comments"><strong>Comments:</strong> ${job.comments || "-"}</span>

                <textarea class="comment-box" id="comment-${job.id}" placeholder="Add comment"></textarea>
                <button onclick="addComment(${job.id})">Save Comment</button>
                <button onclick="markCompleted(${job.id})">Mark Completed</button>
            `;

            jobsList.appendChild(jobDiv);
        });

    } catch (error) {
        jobsList.innerHTML = "<p class='error'>Error loading jobs</p>";
    }
}

async function markCompleted(jobId) {
    try {
        const response = await fetch(`http://localhost:8080/jobs/${jobId}/status?status=COMPLETED`, {
            method: "PUT",
            headers: getAuthHeader()
        });

        if (response.ok) {
            loadDriverJobs();
        } else {
            alert("Failed to update job");
        }

    } catch (error) {
        alert("Error updating job");
    }
}

async function addComment(jobId) {
    const comment = document.getElementById(`comment-${jobId}`).value;

    await fetch(`http://localhost:8080/jobs/${jobId}/comment`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ comment })
    });

    loadDriverJobs();
}