document.getElementById("jobForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const pickupLocation = document.getElementById("pickupLocation").value;
    const deliveryLocation = document.getElementById("deliveryLocation").value;
    const driverId = document.getElementById("driverId").value;
    const jobMessage = document.getElementById("jobMessage");

    const jobData = {
        pickupLocation: pickupLocation,
        deliveryLocation: deliveryLocation,
        driver: {
            id: parseInt(driverId)
        }
    };

    try {
        const response = await fetch("/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jobData)
        });

        if (response.ok) {
            jobMessage.textContent = "Job created successfully";
            jobMessage.className = "success";
            document.getElementById("jobForm").reset();
            loadJobs();
        } else {
            jobMessage.textContent = "Failed to create job";
            jobMessage.className = "error";
        }
    } catch (error) {
        jobMessage.textContent = "Error creating job";
        jobMessage.className = "error";
    }
});

async function loadJobs() {
    const jobsList = document.getElementById("jobsList");
    jobsList.innerHTML = "";

    try {
        const response = await fetch("/jobs");

        if (!response.ok) {
            jobsList.innerHTML = "<p class='error'>Could not load jobs</p>";
            return;
        }

        const jobs = await response.json();

        if (jobs.length === 0) {
            jobsList.innerHTML = "<p>No jobs found</p>";
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
                <p><strong>Driver ID:</strong> ${job.driver ? job.driver.id : "Not assigned"}</p>
            `;

            jobsList.appendChild(jobDiv);
        });
    } catch (error) {
        jobsList.innerHTML = "<p class='error'>Error loading jobs</p>";
    }
}