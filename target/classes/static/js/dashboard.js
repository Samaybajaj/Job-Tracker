const API_URL = '/api/jobs';
let allJobs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    fetchJobs();

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    document.getElementById('platformFilter').addEventListener('change', handleFilter);
    document.getElementById('sortToggle').addEventListener('click', toggleSort);
});

async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();
        
        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-applied').textContent = stats.applied;
        document.getElementById('stat-interview').textContent = stats.interview;
        document.getElementById('stat-assessment').textContent = stats.assessment;
        document.getElementById('stat-offered').textContent = stats.offered;
        document.getElementById('stat-rejected').textContent = stats.rejected;
        document.getElementById('stat-success').textContent = stats.successRate + '%';
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

async function fetchJobs() {
    try {
        const response = await fetch(API_URL);
        allJobs = await response.json();
        renderJobs(allJobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

function renderJobs(jobs) {
    const tbody = document.getElementById('jobsTableBody');
    tbody.innerHTML = '';
    
    if (jobs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No jobs found</td></tr>';
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    jobs.forEach(job => {
        const tr = document.createElement('tr');
        
        // Check for follow-up warning
        if (job.followUpDate && job.followUpDate < today && 
            (job.status === 'Applied' || job.status === 'Interview')) {
            tr.classList.add('follow-up-warning');
        }

        tr.innerHTML = `
            <td>
                ${job.jobUrl ? `<a href="${job.jobUrl}" target="_blank" style="color: inherit;">${job.companyName}</a>` : job.companyName}
            </td>
            <td>${job.jobTitle}</td>
            <td>${job.jobType || '-'}</td>
            <td>${job.platform || '-'}</td>
            <td>${job.appliedDate}</td>
            <td>${job.followUpDate || '-'}</td>
            <td>
                <select class="status-badge status-${job.status}" onchange="updateStatus(${job.id}, this.value, this)">
                    <option value="Applied" ${job.status === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Interview" ${job.status === 'Interview' ? 'selected' : ''}>Interview</option>
                    <option value="Assessment" ${job.status === 'Assessment' ? 'selected' : ''}>Assessment</option>
                    <option value="Offered" ${job.status === 'Offered' ? 'selected' : ''}>Offered</option>
                    <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td>
                <a href="edit.html?id=${job.id}" class="btn btn-sm btn-secondary">Edit</a>
                <button onclick="deleteJob(${job.id})" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateStatus(id, newStatus, selectElement) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            // Update class for styling
            selectElement.className = `status-badge status-${newStatus}`;
            fetchStats(); // update stats
            
            // update in local array for sorting/filtering
            const job = allJobs.find(j => j.id === id);
            if(job) job.status = newStatus;
        } else {
            alert('Failed to update status');
            fetchJobs(); // revert on fail
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
        fetchJobs(); // revert
    }
}

async function deleteJob(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                fetchJobs();
                fetchStats();
            } else {
                alert('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error deleting job');
        }
    }
}

let sortAsc = false;
function toggleSort() {
    sortAsc = !sortAsc;
    const btn = document.getElementById('sortToggle');
    btn.textContent = `Sort: ${sortAsc ? 'Oldest First' : 'Newest First'}`;
    handleFilter(); // re-apply current filters and sort
}

function handleSearch() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    // Instead of API call, we can filter locally for fast UX since we fetched all
    // Or we could use the API endpoint if desired. Locally is faster for UI.
    const filtered = allJobs.filter(job => 
        job.companyName.toLowerCase().includes(keyword) || 
        job.jobTitle.toLowerCase().includes(keyword)
    );
    
    applyFiltersAndSort(filtered);
}

function handleFilter() {
    handleSearch(); // Triggers the pipeline
}

function applyFiltersAndSort(baseJobs = allJobs) {
    const statusFilter = document.getElementById('statusFilter').value;
    const platformFilter = document.getElementById('platformFilter').value;
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = baseJobs.filter(job => {
        const matchStatus = statusFilter === 'All' || job.status === statusFilter;
        const matchPlatform = platformFilter === 'All' || job.platform === platformFilter;
        const matchSearch = job.companyName.toLowerCase().includes(keyword) || job.jobTitle.toLowerCase().includes(keyword);
        return matchStatus && matchPlatform && matchSearch;
    });

    filtered.sort((a, b) => {
        const dateA = new Date(a.appliedDate);
        const dateB = new Date(b.appliedDate);
        return sortAsc ? dateA - dateB : dateB - dateA;
    });

    renderJobs(filtered);
}
