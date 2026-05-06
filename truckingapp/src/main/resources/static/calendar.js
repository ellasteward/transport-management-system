// AUTH HEADER (correct version)
function getAuthHeader() {
    return {
        "Authorization": localStorage.getItem("auth")
    };
}

// LOAD WEEK JOBS
async function loadWeekJobs() {
    const startDate = document.getElementById("weekStart").value;
    const tableBody = document.getElementById("calendarBody");

    tableBody.innerHTML = "";

    if (!startDate) {
        alert("Please select a date");
        return;
    }

    try {
        // GET ALL JOBS
        const res = await fetch("http://localhost:8080/jobs", {
            headers: getAuthHeader()
        });

        if (!res.ok) {
            tableBody.innerHTML = "<tr><td colspan='5'>Failed to load jobs</td></tr>";
            return;
        }

        const jobs = await res.json();

        // START DATE
        const start = new Date(startDate);

        // LOOP 7 DAYS
        for (let i = 0; i < 7; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);

            const dateStr = current.toISOString().split("T")[0];

            const dayJobs = jobs.filter(job => job.jobDate === dateStr);

            // DATE HEADER ROW
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
                        <td>${job.driver ? job.driver.name : "Unassigned"}</td>
                        <td>${job.truckType || "-"}</td>
                        <td>${job.weight || "-"} kg</td>
                    `;

                    tableBody.appendChild(row);
                });
            }
        }

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = "<tr><td colspan='5'>Error loading jobs</td></tr>";
    }
}