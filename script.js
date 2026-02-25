let jobs = [];
let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
let currentPage = 1;
const jobsPerPage = 3;

// Fetch Data
fetch("data.json")
    .then(res => res.json())
    .then(data => {
        jobs = data;
        applyFilters();
    });

const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");
const categoryFilter = document.getElementById("categoryFilter");
const experienceFilter = document.getElementById("experienceFilter");
const sortSalary = document.getElementById("sortSalary");
const themeToggle = document.getElementById("themeToggle");

// Salary Extract
function extractSalary(salary) {
    return parseFloat(salary.replace(/[^\d.]/g, ""));
}

// Main Filter Function
function applyFilters() {

    let filtered = jobs.filter(job => {

        return (
            job.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
            (locationFilter.value === "" || job.location === locationFilter.value) &&
            (categoryFilter.value === "" || job.category === categoryFilter.value) &&
            (experienceFilter.value === "" || job.experience === experienceFilter.value)
        );
    });

    // Sorting
    if (sortSalary.value === "low") {
        filtered.sort((a, b) => extractSalary(a.salary) - extractSalary(b.salary));
    }
    if (sortSalary.value === "high") {
        filtered.sort((a, b) => extractSalary(b.salary) - extractSalary(a.salary));
    }

    document.getElementById("jobCount").innerText =
        `Showing ${filtered.length} Jobs`;

    displayJobs(filtered);
}

// Display with Pagination
function displayJobs(data) {

    const container = document.getElementById("jobContainer");
    container.innerHTML = "";

    const start = (currentPage - 1) * jobsPerPage;
    const paginated = data.slice(start, start + jobsPerPage);

    if (paginated.length === 0) {
        container.innerHTML = "<h4 class='text-center'>No Jobs Found 😔</h4>";
        return;
    }

    paginated.forEach(job => {

        const isSaved = savedJobs.includes(job.id);

        container.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card p-3 h-100">

                <h5>${job.title}</h5>
                <p><b>${job.company}</b></p>
                <span class="badge bg-primary">${job.category}</span>
                <span class="badge bg-success">${job.experience}</span>
                <p class="mt-2">${job.location}</p>
                <p><b>${job.salary}</b></p>

                <div class="d-flex justify-content-between mt-auto">
                    <button class="btn btn-sm btn-dark"
                    onclick="viewMore(${job.id})">View</button>

                    <button class="btn btn-sm btn-outline-danger"
                    onclick="toggleSave(${job.id})">
                    ${isSaved ? "❤️" : "🤍"}
                    </button>
                </div>

            </div>
        </div>
        `;
    });

    setupPagination(data);
}

// Pagination Buttons
function setupPagination(data) {

    const pageCount = Math.ceil(data.length / jobsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        pagination.innerHTML += `
        <button class="btn btn-sm btn-secondary"
        onclick="changePage(${i})">${i}</button>
        `;
    }
}

function changePage(page) {
    currentPage = page;
    applyFilters();
}

// Save Job
function toggleSave(id) {

    if (savedJobs.includes(id)) {
        savedJobs = savedJobs.filter(jobId => jobId !== id);
    } else {
        savedJobs.push(id);
    }

    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    applyFilters();
}

// View Saved
document.getElementById("viewSaved").addEventListener("click", () => {

    const filtered = jobs.filter(job => savedJobs.includes(job.id));
    displayJobs(filtered);
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Modal View
function viewMore(id) {

    const job = jobs.find(j => j.id === id);

    document.getElementById("modalTitle").innerText = job.title;
    document.getElementById("modalBody").innerHTML = `
        <p><b>Company:</b> ${job.company}</p>
        <p><b>Location:</b> ${job.location}</p>
        <p><b>Category:</b> ${job.category}</p>
        <p><b>Experience:</b> ${job.experience}</p>
        <p><b>Salary:</b> ${job.salary}</p>
        <p>${job.description}</p>
    `;

    const modal = new bootstrap.Modal(document.getElementById("jobModal"));
    modal.show();
}

// Event Listeners
searchInput.addEventListener("input", applyFilters);
locationFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
experienceFilter.addEventListener("change", applyFilters);
sortSalary.addEventListener("change", applyFilters);