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
    loadDriverFilters();

    document
        .getElementById("truckType")
        .addEventListener("change", filterDriversByTruck);

    // hide driver management for dispatchers
    const username =
        localStorage.getItem("username");

    if (
        username &&
        username.toLowerCase().includes("dispatch")
    ) {

        const link =
            document.getElementById("manageDriversLink");

        if (link) {
            link.style.display = "none";
        }
    }

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

    filterDriversByTruck();
}

async function createJob() {

    const pickupLocation =
        document.getElementById("pickupLocation").value.trim();

    const deliveryLocation =
        document.getElementById("deliveryLocation").value.trim();

    const jobDate =
        document.getElementById("jobDate").value;

    const weight =
        document.getElementById("weight").value;

    const truckType =
        document.getElementById("truckType").value;

    const comments =
        document.getElementById("comments").value;

    const driverId =
        document.getElementById("driverId").value;

    // FRONTEND VALIDATION
    if (
        !pickupLocation ||
        !deliveryLocation ||
        !jobDate ||
        !weight ||
        !truckType ||
        !driverId
    ) {
document.getElementById("errorMessage").innerText =
    "Please complete all required fields";
            return;
    }

    const body = {
        pickupLocation,
        deliveryLocation,
        jobDate,
        weight,
        truckType,
        comments
    };

    const res = await fetch(
        "http://localhost:8080/jobs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify(body)
        }
    );

    // STOP IF BACKEND FAILED
    if (!res.ok) {
        alert("Failed to create job");
        return;
    }

    const job = await res.json();

    await fetch(
        `http://localhost:8080/jobs/${job.id}/assign/${driverId}`,
        {
            method: "PUT",
            headers: getAuthHeader()
        }
    );

    alert("Job created!");

    loadJobs();
}

// LOAD JOBS
async function loadJobs() {

    const res = await fetch("http://localhost:8080/jobs", {
        headers: getAuthHeader()
    });

    const jobs = await res.json();

    renderJobs(jobs);
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

async function loadFilteredJobs() {

    const date = document.getElementById("filterDate").value;
    const driverId = document.getElementById("filterDriver").value;
    const status = document.getElementById("filterStatus").value;

    const res = await fetch("http://localhost:8080/jobs", {
        headers: getAuthHeader()
    });

    let jobs = await res.json();

    // FILTER DATE
    if (date) {
        jobs = jobs.filter(j => j.jobDate === date);
    }

    // FILTER DRIVER
    if (driverId) {
        jobs = jobs.filter(j =>
            j.driver && j.driver.id == driverId
        );
    }

    // FILTER STATUS
    if (status) {
        jobs = jobs.filter(j => j.status === status);
    }

    renderJobs(jobs);
}

async function loadDriverFilterDropdown() {

    const res = await fetch("http://localhost:8080/drivers", {
        headers: getAuthHeader()
    });

    const drivers = await res.json();

    const dropdown = document.getElementById("filterDriver");

    dropdown.innerHTML =
        `<option value="">All Drivers</option>`;

    drivers.forEach(driver => {

        dropdown.innerHTML += `
            <option value="${driver.id}">
                ${driver.name}
            </option>
        `;
    });
}

function renderJobs(jobs) {

    const tableBody = document.getElementById("jobTableBody");
    tableBody.innerHTML = "";

    jobs.forEach(job => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${job.id}</td>

            <td>
                ${job.pickupLocation} → ${job.deliveryLocation}
            </td>

            <td>${job.jobDate || "N/A"}</td>

            <td>${job.weight || "N/A"} kg</td>

            <td>${job.truckType || "N/A"}</td>

            <td>
                ${job.driver ? job.driver.name : "None"}
            </td>

            <td>
                <span class="
                    ${job.status === "COMPLETED"
                        ? "status-completed"
                        : job.status === "IN_PROGRESS"
                        ? "status-progress"
                        : "status-pending"}
                ">
                    ${job.status}
                </span>
            </td>

            <td>${job.comments || "-"}</td>

            <td>

                <div class="job-buttons">

                    <button onclick="viewJob(${job.id})">
                        View Job
                    </button>

                    <button onclick="markCompleted(${job.id})">
                        Mark Complete
                    </button>

                </div>

            </td>
        `;

        tableBody.appendChild(row);
    });
}

function filterDriversByTruck() {

    const selectedTruck =
        document.getElementById("truckType").value;

    const driverSelect =
        document.getElementById("driverId");

    driverSelect.innerHTML =
        "<option value=''>Select Driver</option>";

    const filteredDrivers = allDrivers.filter(driver =>
        driver.truckType === selectedTruck
    );

    filteredDrivers.forEach(driver => {

        driverSelect.innerHTML += `
            <option value="${driver.id}">
                ${driver.name} (${driver.truckType})
            </option>
        `;
    });
}

async function loadDriverFilters() {

    const res = await fetch("http://localhost:8080/drivers", {
        headers: getAuthHeader()
    });

    const drivers = await res.json();

    const filterDropdown =
        document.getElementById("filterDriver");

    filterDropdown.innerHTML =
        `<option value="">All Drivers</option>`;

    drivers.forEach(driver => {

        filterDropdown.innerHTML += `
            <option value="${driver.id}">
                ${driver.name}
            </option>
        `;
    });
}
function viewJob(jobId) {
    window.location.href =
        `/job.html?id=${jobId}&mode=admin`;
}


function logout() {

    localStorage.removeItem("auth");
    localStorage.removeItem("username");

    window.location.href = "/login.html";
}