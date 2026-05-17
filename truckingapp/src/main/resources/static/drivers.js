let currentEditDriverId = null;
let allDrivers = [];

// AUTH
function getAuthHeader() {
    return {
        "Authorization": localStorage.getItem("auth")
    };
}

// LOAD DRIVERS
async function loadDrivers() {
    try {

        const driversContainer =
            document.getElementById("driversList");

        const dispatchersContainer =
            document.getElementById("dispatchersList");

        const res = await fetch("http://localhost:8080/drivers", {
            headers: getAuthHeader()
        });

        allDrivers = await res.json();

        console.log(allDrivers);

        driversContainer.innerHTML = "";
        dispatchersContainer.innerHTML = "";

        allDrivers.forEach(d => {

            const card = document.createElement("div");

            card.className = "job-card";

            card.innerHTML = `
                <div class="info">
                    <p><strong>ID:</strong> ${d.id}</p>
                    <p><strong>Name:</strong> ${d.name}</p>
                    <p><strong>Phone:</strong> ${d.phone}</p>
                    <p><strong>License:</strong> ${d.licenseNumber || "-"}</p>
${d.role === "DRIVER"
    ? `<p><strong>Truck:</strong> ${d.truckType || "-"}</p>`
    : ""
}                    <p><strong>Role:</strong> ${d.role}</p>
                </div>

                <div class="actions">
                    <button onclick="editDriver(${d.id})">
                        Edit
                    </button>

                    <button onclick="deleteDriver(${d.id})">
                        Delete
                    </button>
                </div>
            `;

            if (d.role === "DISPATCHER") {

                dispatchersContainer.appendChild(card);

            } else {

                driversContainer.appendChild(card);
            }

        });

    } catch (err) {

        console.error("Error loading drivers:", err);

    }
}

// EDIT DRIVER
function editDriver(id) {
    currentEditDriverId = id;

    const driver = allDrivers.find(d => d.id === id);
    if (!driver) return;

    document.getElementById("driverName").value = driver.name;
    document.getElementById("driverPhone").value = driver.phone;
    document.getElementById("licenseNumber").value = driver.licenseNumber;
    document.getElementById("driverTruckType").value = driver.truckType;
    document.getElementById("driverUsername").value = driver.username || "";
    document.getElementById("driverPassword").value = "";

    document.getElementById("createDriverBtn").innerText = "Update Driver";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// CREATE OR UPDATE
async function createDriver() {
    const name = document.getElementById("driverName").value;
    const phone = document.getElementById("driverPhone").value;
    const licenseNumber = document.getElementById("licenseNumber").value;
    const truckType = document.getElementById("driverTruckType").value;
    const username = document.getElementById("driverUsername").value;
    const password = document.getElementById("driverPassword").value;
    const role = document.getElementById("userRole").value;

const body = {
    name,
    phone,
    licenseNumber,
    truckType,
    username,
    role
};
    if (password) body.password = password;

    if (currentEditDriverId) {
        await fetch(`http://localhost:8080/drivers/${currentEditDriverId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify(body)
        });

        alert("Driver updated!");
        currentEditDriverId = null;
        document.getElementById("createDriverBtn").innerText = "Create";

    } else {
        await fetch("http://localhost:8080/drivers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },
            body: JSON.stringify(body)
        });

        alert("Driver created!");
    }

    loadDrivers();
}

// DELETE
async function deleteDriver(id) {
    if (!confirm("Delete this driver?")) return;

    try {
        const res = await fetch(`http://localhost:8080/drivers/${id}`, {
            method: "DELETE",
            headers: getAuthHeader()
        });

        if (res.ok) {
            alert("Driver deleted!");
            loadDrivers();
        } else {
            const message = await res.text();
            alert(" " + message);
        }

    } catch (err) {
        console.error(err);
        alert("Error deleting driver");
    }
}

// LOAD PAGE
document.addEventListener("DOMContentLoaded", loadDrivers);

// ROLE CHANGE
document.getElementById("userRole").addEventListener("change", function () {

    const role = this.value;

    const truckSection =
        document.getElementById("truckTypeSection");

    if (role === "DISPATCHER") {

        truckSection.style.display = "none";

    } else {

        truckSection.style.display = "block";
    }
});

