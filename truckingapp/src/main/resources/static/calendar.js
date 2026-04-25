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

    const tableBody = document.getElementById("calendarBody");
    tableBody.innerHTML = "";

    const start = new Date(startDate);

    // loop 7 days
    for (let i = 0; i < 7; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);

        const dateStr = current.toISOString().split("T")[0];

        const dayJobs = jobs.filter(j => j.jobDate === dateStr);

        // DATE HEADER ROW (only once per day)
        const dateRow = document.createElement("tr");
        dateRow.innerHTML = `
            <td colspan="5" style="font-weight:bold; background:#eef2f7;">
                ${dateStr}
            </td>
        `;
        tableBody.appendChild(dateRow);

        if (dayJobs.length === 0) {
            const emptyRow = document.createElement("tr");
            emptyRow.innerHTML = `
                <td></td>
                <td colspan="4" style="color:#999;">No jobs</td>
            `;
            tableBody.appendChild(emptyRow);
        } else {
            dayJobs.forEach(job => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td></td>
                    <td>${job.pickupLocation} → ${job.deliveryLocation}</td>
                    <td>${job.driver ? job.driver.name : "None"}</td>
                    <td>${job.truckType || "N/A"}</td>
                    <td>${job.weight || "N/A"} kg</td>
                `;

                tableBody.appendChild(row);
            });
        }
    }
}