const rsvpButton = document.getElementById('rsvp-button');
const rsvpForm = document.getElementById('rsvp-form');

rsvpButton.addEventListener('click', () => {
    rsvpForm.classList.remove('hidden');
    rsvpButton.classList.add('hidden');
});

rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const attendance = document.getElementById('attendance').value;

    try {
        const response = await fetch('/api/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, attendance }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert(`Thank you, ${name}! Your RSVP (${attendance}) has been recorded.`);
        rsvpForm.reset();
        rsvpForm.classList.add('hidden');
        rsvpButton.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your RSVP. Please try again.');
    }
});