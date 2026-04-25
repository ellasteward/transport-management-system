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

    const jobId = localStorage.getItem("editJobId");

    const jobData = {
        pickupLocation: document.getElementById("pickupLocation").value,
        deliveryLocation: document.getElementById("deliveryLocation").value,
        jobDate: document.getElementById("jobDate").value,
        weight: document.getElementById("weight").value,
        truckType: document.getElementById("truckType").value,
        comments: document.getElementById("comments").value
    };

    if (jobId) {
        // UPDATE EXISTING JOB
        await fetch(`http://localhost:8080/jobs/${jobId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify(jobData)
        });

        localStorage.removeItem("editJobId");

        alert("Job updated!");
        document.querySelector("#jobForm button").innerText = "Create Job";

    } else {
        // CREATE NEW JOB
        const res = await fetch("http://localhost:8080/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify(jobData)
        });

        const job = await res.json();

        const driverId = document.getElementById("driverId").value;

        await fetch(`http://localhost:8080/jobs/${job.id}/assign/${driverId}`, {
            method: "PUT",
            headers: getAuthHeader()
        });

        alert("Job created!");
    }

    loadJobs();
});

// LOAD JOBS
async function loadJobs() {
    const res = await fetch("http://localhost:8080/jobs", {
        headers: getAuthHeader()
    });

    const jobs = await res.json();

    const tableBody = document.getElementById("jobTableBody");
    tableBody.innerHTML = "";

    jobs.forEach(job => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${job.id}</td>
            <td>${job.pickupLocation} → ${job.deliveryLocation}</td>
            <td>${job.jobDate || "N/A"}</td>
            <td>${job.weight || "N/A"} kg</td>
            <td>${job.truckType || "N/A"}</td>
            <td>${job.driver ? job.driver.id : "None"}</td>
            <td>
                <span class="${job.status === "COMPLETED" ? "completed" : "pending"}">
                    ${job.status}
                </span>
            </td>
            <td>${job.comments || "-"}</td>
            <td>
                <input id="comment-${job.id}" placeholder="Add comment">
                <button onclick="addComment(${job.id})">Save</button>
                <button onclick="markCompleted(${job.id})">✔</button>
                <button onclick="editJob(${job.id})">Edit</button>
            </td>
        `;

        tableBody.appendChild(row);
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


async function addComment(jobId) {
    const comment = document.getElementById(`comment-${jobId}`).value;

    console.log("Adding comment:", comment);

    await fetch(`http://localhost:8080/jobs/${jobId}/comment`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ comment })
    });

    loadJobs();
}


async function markCompleted(jobId) {
    console.log("Marking complete:", jobId);

    await fetch(`http://localhost:8080/jobs/${jobId}/status?status=COMPLETED`, {
        method: "PUT",
        headers: getAuthHeader()
    });

    loadJobs();
}

function editJob(jobId) {
    console.log("Editing job:", jobId);

    localStorage.setItem("editJobId", jobId);

    // scroll user up to form
    window.scrollTo({ top: 0, behavior: "smooth" });

    loadJobIntoForm(jobId);
}

async function loadJobIntoForm(jobId) {
    const res = await fetch("http://localhost:8080/jobs", {
        headers: getAuthHeader()
    });

    const jobs = await res.json();
    const job = jobs.find(j => j.id == jobId);

    if (!job) return;

    document.getElementById("pickupLocation").value = job.pickupLocation;
    document.getElementById("deliveryLocation").value = job.deliveryLocation;
    document.getElementById("jobDate").value = job.jobDate || "";
    document.getElementById("weight").value = job.weight || "";
    document.getElementById("truckType").value = job.truckType || "";
    document.getElementById("comments").value = job.comments || "";
}