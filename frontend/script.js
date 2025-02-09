document.getElementById('resultForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const startRoll = document.getElementById('startRoll').value.trim();
    const endRoll = document.getElementById('endRoll').value.trim();
    const semester = document.getElementById('semester').value;

    // Validate roll number format (e.g., 0105IT211093)
    const rollNumberRegex = /^\d{4}[A-Za-z]{2}\d{6}$/;
    if (!rollNumberRegex.test(startRoll) || !rollNumberRegex.test(endRoll)) {
        alert('Please enter valid roll numbers in the format 0105IT211093.');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Fetching results... Please wait.</p>';

    try {
        // Update this URL to match your backend server
        const response = await fetch('http://localhost:5000/fetch-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                startRoll: startRoll, // Send as string
                endRoll: endRoll,     // Send as string
                semester: parseInt(semester)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch results.');
        }

        const results = await response.json();
        resultsDiv.innerHTML = '';
        for (const [roll, result] of Object.entries(results)) {
            resultsDiv.innerHTML += `<p><strong>Roll Number:</strong> ${roll}, <strong>Result:</strong> ${result}</p>`;
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = '<p style="color: red;">An error occurred while fetching results. Please try again.</p>';
    }
});