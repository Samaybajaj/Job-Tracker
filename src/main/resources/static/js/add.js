const API_URL = '/api/jobs';

document.addEventListener('DOMContentLoaded', () => {
    // Set default applied date to today
    document.getElementById('appliedDate').valueAsDate = new Date();

    document.getElementById('addForm').addEventListener('submit', async (e) => {
        e.preventDefault();

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
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });

            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                alert('Failed to add job application.');
            }
        } catch (error) {
            console.error('Error adding job:', error);
            alert('Error adding job application.');
        }
    });
});
