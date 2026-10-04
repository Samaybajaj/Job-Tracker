const API_URL = '/api/jobs';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (jobId) {
        fetchJobDetails(jobId);
    } else {
        alert('No job ID provided');
        window.location.href = 'index.html';
    }

    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('jobId').value;
        const jobData = {
            companyName: document.getElementById('companyName').value,
            jobTitle: document.getElementById('jobTitle').value,
            jobType: document.getElementById('jobType').value,
            platform: document.getElementById('platform').value,
            status: document.getElementById('status').value,
            appliedDate: document.getElementById('appliedDate').value,
            followUpDate: document.getElementById('followUpDate').value || null,
            jobUrl: document.getElementById('jobUrl').value,
            notes: document.getElementById('notes').value
        };

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });

            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                alert('Failed to update job application.');
            }
        } catch (error) {
            console.error('Error updating job:', error);
            alert('Error updating job application.');
        }
    });
});

async function fetchJobDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const job = await response.json();
            
            document.getElementById('jobId').value = job.id;
            document.getElementById('companyName').value = job.companyName;
            document.getElementById('jobTitle').value = job.jobTitle;
            document.getElementById('jobType').value = job.jobType || '';
            document.getElementById('platform').value = job.platform || '';
            document.getElementById('status').value = job.status;
            document.getElementById('appliedDate').value = job.appliedDate;
            document.getElementById('followUpDate').value = job.followUpDate || '';
            document.getElementById('jobUrl').value = job.jobUrl || '';
            document.getElementById('notes').value = job.notes || '';
        } else {
            alert('Job not found');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        alert('Error fetching job details');
    }
}
