let jobs = [];

// Fetch Data
fetch("data.json")
    .then(res => res.json())
    .then(data => {
        jobs = data;
        displayJobs(jobs);
    });

// Elements
const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");
const categoryFilter = document.getElementById("categoryFilter");
const experienceFilter = document.getElementById("experienceFilter");
const resetBtn = document.getElementById("resetBtn");

// Display Jobs
function displayJobs(data) {

    const container = document.getElementById("jobContainer");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<h4>No Jobs Found</h4>";
        return;
    }

    data.forEach(job => {

        const card = `
        <div class="col-md-4 mb-4">
            <div class="card p-3 h-100">

                <h5 class="card-title">${job.title}</h5>

                <p><b>${job.company}</b></p>

                <span class="badge bg-primary">${job.category}</span>
                <span class="badge bg-success">${job.experience}</span>

                <p class="mt-2">${job.location}</p>

                <p><b>${job.salary}</b></p>

                <p>${job.description.substring(0,50)}...</p>

                <button class="btn btn-sm btn-dark mt-auto"
                onclick="viewMore(${job.id})">
                View More
                </button>

            </div>
        </div>
        `;

        container.innerHTML += card;
    });
}

// Filter Function
function filterJobs() {

    const search = searchInput.value.toLowerCase();
    const location = locationFilter.value;
    const category = categoryFilter.value;
    const experience = experienceFilter.value;

    const filtered = jobs.filter(job => {

        return (
            job.title.toLowerCase().includes(search) &&
            (location === "" || job.location === location) &&
            (category === "" || job.category === category) &&
            (experience === "" || job.experience === experience)
        );
    });

    displayJobs(filtered);
}

// Event Listeners
searchInput.addEventListener("input", filterJobs);
locationFilter.addEventListener("change", filterJobs);
categoryFilter.addEventListener("change", filterJobs);
experienceFilter.addEventListener("change", filterJobs);

// Reset
resetBtn.addEventListener("click", () => {

    searchInput.value = "";
    locationFilter.value = "";
    categoryFilter.value = "";
    experienceFilter.value = "";

    displayJobs(jobs);
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
        <p><b>Description:</b> ${job.description}</p>
    `;

    const modal = new bootstrap.Modal(document.getElementById("jobModal"));
    modal.show();
}