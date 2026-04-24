function getAuthHeader() {
    return {
        "Authorization": "Basic " + btoa("admin:admin123")
    };
}

// LOAD DRIVERS
async function loadDrivers() {
    const list = document.getElementById("driverList");

    const res = await fetch("http://localhost:8080/drivers", {
        headers: getAuthHeader()
    });

    const drivers = await res.json();

    list.innerHTML = "";

    drivers.forEach(d => {
        list.innerHTML += `
            <div class="job-card">
                <p><strong>ID:</strong> ${d.id}</p>

                <input id="name-${d.id}" value="${d.name}">
                <input id="phone-${d.id}" value="${d.phone}">
                <input id="license-${d.id}" value="${d.licenseNumber}">

                <select id="truck-${d.id}">
                    <option ${d.truckType === "HIAB" ? "selected" : ""}>HIAB</option>
                    <option ${d.truckType === "TRUCK" ? "selected" : ""}>TRUCK</option>
                    <option ${d.truckType === "TRUCK_TRAILER" ? "selected" : ""}>TRUCK_TRAILER</option>
                </select>

                <br><br>

                <button onclick="updateDriver(${d.id})">Save</button>
                <button onclick="deleteDriver(${d.id})">Delete</button>
            </div>
        `;
    });
}

// UPDATE DRIVER
async function updateDriver(id) {
    const name = document.getElementById(`name-${id}`).value;
    const phone = document.getElementById(`phone-${id}`).value;
    const licenseNumber = document.getElementById(`license-${id}`).value;
    const truckType = document.getElementById(`truck-${id}`).value;

    await fetch(`http://localhost:8080/drivers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
        },
        body: JSON.stringify({ name, phone, licenseNumber, truckType })
    });

    alert("Driver updated!");
    loadDrivers();
}

// DELETE DRIVER
async function deleteDriver(id) {
    if (!confirm("Delete this driver?")) return;

    const res = await fetch(`http://localhost:8080/drivers/${id}`, {
        method: "DELETE",
        headers: getAuthHeader()
    });

    if (!res.ok) {
        alert("Cannot delete driver (they may have jobs assigned)");
        return;
    }

    loadDrivers();
}

// LOAD ON PAGE
document.addEventListener("DOMContentLoaded", loadDrivers);