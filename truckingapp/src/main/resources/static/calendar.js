function getAuthHeader() {
    return {
        "Authorization": "Basic " + btoa("admin:admin123")
    };
}

// Load jobs for selected week
async function loadWeekJobs() {
    const startDate = document.getElementById("weekStart").value;

    if (!startDate) {
        alert("Please select a date");
        return;
    }

    const res = await fetch("http://localhost:8080/jobs", {
        headers: getAuthHeader()
    });

    const jobs = await res.json();

    const container = document.getElementById("calendarList");
    container.innerHTML = "";

    // Convert start date to Date object
    const start = new Date(startDate);

    // Loop 7 days (week)
    for (let i = 0; i < 7; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);

        const dateStr = current.toISOString().split("T")[0];

        // Filter jobs for this date
        const dayJobs = jobs.filter(j => j.jobDate === dateStr);

        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";

        dayDiv.innerHTML = `
            <h3>${dateStr}</h3>
        `;

        if (dayJobs.length === 0) {
            dayDiv.innerHTML += `<p class="no-jobs">No jobs</p>`;
        } else {
            dayJobs.forEach(job => {
                dayDiv.innerHTML += `
                    <div class="job-card">
                        <p><strong>${job.pickupLocation} → ${job.deliveryLocation}</strong></p>
                        <p>Driver: ${job.driver ? job.driver.name : "None"}</p>
                        <p>Truck: ${job.truckType || "N/A"}</p>
                        <p>Weight: ${job.weight || "N/A"} kg</p>
                    </div>
                `;
            });
        }

        container.appendChild(dayDiv);
    }
}