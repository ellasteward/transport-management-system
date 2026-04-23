async function loadDriverJobs() {
    const driverId = document.getElementById("driverId").value;
    const jobsList = document.getElementById("driverJobsList");

    jobsList.innerHTML = "";

    if (!driverId) {
        jobsList.innerHTML = "<p class='error'>Enter driver ID</p>";
        return;
    }

    try {
        const response = await fetch(`/jobs/driver/${driverId}`);

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
                <p><strong>Pickup:</strong> ${job.pickupLocation}</p>
                <p><strong>Delivery:</strong> ${job.deliveryLocation}</p>
                <p><strong>Status:</strong> ${job.status}</p>
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
        const response = await fetch(`/jobs/${jobId}/status?status=COMPLETED`, {
            method: "PUT"
        });

        if (response.ok) {
            loadDriverJobs(); // FIXED
        } else {
            alert("Failed to update job");
        }
    } catch (error) {
        alert("Error updating job");
    }
}