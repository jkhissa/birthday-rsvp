// public/admin-script.js
const refreshButton = document.getElementById('refresh-button');
const exportButton = document.getElementById('export-button');
const rsvpTable = document.getElementById('rsvp-table').getElementsByTagName('tbody')[0];

async function refreshRSVPs() {
    try {
        const response = await fetch('/api/rsvps');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        rsvpTable.innerHTML = '';
        data.forEach(rsvp => {
            const row = rsvpTable.insertRow();
            row.insertCell(0).textContent = rsvp.name;
            row.insertCell(1).textContent = rsvp.attendance;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error fetching RSVPs. Please try again.');
    }
}

refreshButton.addEventListener('click', refreshRSVPs);

exportButton.addEventListener('click', () => {
    window.location.href = '/api/export';
});

// Initial load
refreshRSVPs();