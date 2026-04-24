function getAuthHeader() {
    return {
        "Authorization": "Basic " + btoa("admin:admin123")
    };
}

let allDrivers = [];

// LOAD PAGE
document.addEventListener("DOMContentLoaded", () => {
    loadDrivers();
    loadJobs();
});

// LOAD DRIVERS
async function loadDrivers() {
    const res = await fetch("http://localhost:8080/drivers", {
        headers: getAuthHeader()
    });

    allDrivers = await res.json();
    filterDrivers();
}

// FILTER DRIVERS BY TRUCK TYPE
function filterDrivers() {
    const type = document.getElementById("truckType").value;
    const select = document.getElementById("driverId");

    select.innerHTML = "<option>Select Driver</option>";

    allDrivers.forEach(d => {
        // show ALL drivers if no type match
        if (!d.truckType || d.truckType === type) {
            const option = document.createElement("option");
            option.value = d.id;
            option.textContent = `${d.name} (${d.truckType || "No type"})`;
            select.appendChild(option);
        }
    });
}

// CREATE JOB
document.getElementById("jobForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const pickupLocation = document.getElementById("pickupLocation").value;
    const deliveryLocation = document.getElementById("deliveryLocation").value;
    const jobDate = document.getElementById("jobDate").value;
    const weight = document.getElementById("weight").value;
    const truckType = document.getElementById("truckType").value;
    const comments = document.getElementById("comments").value;
    const driverId = document.getElementById("driverId").value;

    try {
        const res = await fetch("http://localhost:8080/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify({
                pickupLocation,
                deliveryLocation,
                jobDate,
                weight,
                truckType,
                comments
            })
        });

        const job = await res.json();

        await fetch(`http://localhost:8080/jobs/${job.id}/assign/${driverId}`, {
            method: "PUT",
            headers: getAuthHeader()
        });

        alert("Job created!");
        loadJobs();

    } catch (err) {
        alert("Error creating job");
    }
});

// LOAD JOBS
async function loadJobs() {
    const list = document.getElementById("jobsList");

    const res = await fetch("http://localhost:8080/jobs", {
        headers: getAuthHeader()
    });

    const jobs = await res.json();

    list.innerHTML = "";

    jobs.forEach(j => {
        list.innerHTML += `
            <div class="job-card">
                <p><strong>ID:</strong> ${j.id}</p>
                <p>${j.pickupLocation} → ${j.deliveryLocation}</p>
                <p>Date: ${j.jobDate || "N/A"}</p>
                <p>Weight: ${j.weight || "N/A"} kg</p>
                <p>Truck: ${j.truckType || "N/A"}</p>
                <p>Driver: ${j.driver ? j.driver.name : "None"}</p>
                <p>Comments: ${j.comments || "-"}</p>
            </div>
        `;
    });
}

// FILTER BY DATE
async function loadJobsByDate() {
    const date = document.getElementById("filterDate").value;

    const res = await fetch("http://localhost:8080/jobs", {
        headers: getAuthHeader()
    });

    const jobs = await res.json();
    const filtered = jobs.filter(j => j.jobDate === date);

    const list = document.getElementById("jobsList");
    list.innerHTML = "";

    filtered.forEach(j => {
        list.innerHTML += `
            <div class="job-card">
                <p>${j.pickupLocation} → ${j.deliveryLocation}</p>
                <p>${j.driver ? j.driver.name : "None"}</p>
            </div>
        `;
    });
}

