const params = new URLSearchParams(window.location.search);

const jobId = params.get("id");
const mode = params.get("mode");

// AUTH
function getAuthHeader() {
    return {
        "Authorization": localStorage.getItem("auth")
    };
}

// PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {

    setupBackButton();

    loadJob();
});

// BACK BUTTON
function setupBackButton() {

    const backButton =
        document.getElementById("backButton");

    backButton.onclick = () => {

        if (mode === "admin") {
            window.location.href = "/admin.html";
        } else {
            window.location.href = "/driver.html";
        }
    };
}

// LOAD JOB
async function loadJob() {

    const container = document.getElementById("jobDetails");

    try {

        const response = await fetch(
            `http://localhost:8080/jobs/${jobId}`,
            {
                headers: getAuthHeader()
            }
        );

        if (!response.ok) {
            container.innerHTML = "<p>Job not found</p>";
            return;
        }

        const job = await response.json();

        if (mode === "admin") {

            container.innerHTML = `

                <div class="section">

                    <div class="job-edit-header">
                        <h2>Edit Job</h2>

                        <span class="status-badge ${job.status.toLowerCase()}">
                            ${job.status}
                        </span>
                    </div>

                    <div class="create-job-form">

                        <div class="create-job-row">

                            <div>
                                <label>Pickup Location</label><br>

                                <input
                                    type="text"
                                    id="pickupLocation"
                                    value="${job.pickupLocation || ""}"
                                >
                            </div>

                            <div>
                                <label>Delivery Location</label><br>

                                <input
                                    type="text"
                                    id="deliveryLocation"
                                    value="${job.deliveryLocation || ""}"
                                >
                            </div>

                        </div>

                        <div class="create-job-row">

                            <div>
                                <label>Date</label><br>

                                <input
                                    type="date"
                                    id="jobDate"
                                    value="${job.jobDate || ""}"
                                >
                            </div>

                            <div>
                                <label>Weight (kg)</label><br>

                                <input
                                    type="number"
                                    id="weight"
                                    value="${job.weight || ""}"
                                >
                            </div>

                        </div>

                        <div class="create-job-row">

                            <div>
                                <label>Truck Type</label><br>

                                <select id="truckType">

                                    <option value="TRUCK"
                                        ${job.truckType === "TRUCK" ? "selected" : ""}>
                                        TRUCK
                                    </option>

                                    <option value="HIAB"
                                        ${job.truckType === "HIAB" ? "selected" : ""}>
                                        HIAB
                                    </option>

                                    <option value="TRUCK_TRAILER"
                                        ${job.truckType === "TRUCK_TRAILER" ? "selected" : ""}>
                                        TRUCK_TRAILER
                                    </option>

                                </select>
                            </div>

                            <div>
                                <label>Status</label><br>

                                <select id="status">

                                    <option value="PENDING"
                                        ${job.status === "PENDING" ? "selected" : ""}>
                                        PENDING
                                    </option>

                                    <option value="IN_PROGRESS"
                                        ${job.status === "IN_PROGRESS" ? "selected" : ""}>
                                        IN_PROGRESS
                                    </option>

                                    <option value="COMPLETED"
                                        ${job.status === "COMPLETED" ? "selected" : ""}>
                                        COMPLETED
                                    </option>

                                </select>
                            </div>

                        </div>

                        <div class="create-job-row">

                            <div style="width:100%;">
                                <label>Comments</label><br>

                                <textarea
                                    id="comments"
                                    style="width:100%; min-height:120px;"
                                >${job.comments || ""}</textarea>
                            </div>

                        </div>

                        <button onclick="saveChanges(${job.id})">
                            Save Changes
                        </button>

                    </div>

                </div>
            `;

        } else {

              container.innerHTML = `

                  <div class="driver-job-view">

                      <div class="driver-job-header">

                          <h2>${job.pickupLocation} → ${job.deliveryLocation}</h2>

                          <span class="status-badge ${job.status.toLowerCase()}">
                              ${job.status}
                          </span>

                      </div>

                      <div class="create-job-form">

                          <div>
                              <label>Date</label><br>

                              <input
                                  type="text"
                                  value="${job.jobDate}"
                                  disabled
                              >
                          </div>

                          <div>
                              <label>Weight (kg)</label><br>

                              <input
                                  type="text"
                                  value="${job.weight}"
                                  disabled
                              >
                          </div>

                          <div>
                              <label>Truck Type</label><br>

                              <input
                                  type="text"
                                  value="${job.truckType}"
                                  disabled
                              >
                          </div>

                          <div>
                              <label>Comments</label>

                              <div class="driver-job-comments">
                                  <p>${job.comments || "-"}</p>
                              </div>

                              <textarea
                                  id="commentBox"
                                  placeholder="Add comment"
                              ></textarea>
                          </div>

                          <div class="driver-job-buttons">

                              <button onclick="saveComment(${job.id})">
                                  Save Comment
                              </button>

                              <button onclick="markCompleted(${job.id})">
                                  Mark Completed
                              </button>

                          </div>

                      </div>

                  </div>
              `;
              }

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Error loading job</p>";
    }
}

async function saveChanges(jobId) {

    const updatedJob = {

        pickupLocation:
            document.getElementById("pickupLocation").value,

        deliveryLocation:
            document.getElementById("deliveryLocation").value,

        jobDate:
            document.getElementById("jobDate").value,

        weight:
            document.getElementById("weight").value,

        truckType:
            document.getElementById("truckType").value,

        comments:
            document.getElementById("comments").value,

        status:
            document.getElementById("status").value
    };

    try {

        await fetch(`http://localhost:8080/jobs/${jobId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },

            body: JSON.stringify(updatedJob)
        });

        alert("Job updated!");

        loadJob();

    } catch (error) {

        console.error(error);

        alert("Error updating job");
    }
}

// DRIVER COMMENT
async function saveComment(jobId) {

    const comment =
        document.getElementById("commentBox").value;

    await fetch(
        `http://localhost:8080/jobs/${jobId}/comment`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },

            body: JSON.stringify({ comment })
        }
    );

    loadJob();
}

// DRIVER COMPLETE
async function markCompleted(jobId) {

    await fetch(
        `http://localhost:8080/jobs/${jobId}/status?status=COMPLETED`,
        {
            method: "PUT",
            headers: getAuthHeader()
        }
    );

    loadJob();
}

// ADMIN SAVE
async function saveJobEdits() {

    const updatedJob = {

        jobDate:
            document.getElementById("editDate").value,

        weight:
            document.getElementById("editWeight").value,

        truckType:
            document.getElementById("editTruck").value,

        comments:
            document.getElementById("commentBox").value
    };

    await fetch(
        `http://localhost:8080/jobs/${jobId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                ...getAuthHeader()
            },

            body: JSON.stringify(updatedJob)
        }
    );

    alert("Job updated!");

    loadJob();
}