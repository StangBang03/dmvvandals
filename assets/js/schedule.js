// schedule.js

async function loadSchedule() {
    try {

        // Change this path to wherever your JSON lives
        const response = await fetch('/assets/json/2026summerschedule.json');

        let wins = 0;
        let losses = 0;
        let ties = 0;

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const scheduleData = await response.json();

        const events = scheduleData.data.events;

        const tableBody = document.getElementById('schedule-table-body');

        // Clear existing rows
        tableBody.innerHTML = '';

        // Sort by game date
        events.sort((a, b) => {
            return new Date(a.start_ts) - new Date(b.start_ts);
        });

        events.forEach(game => {

            const row = document.createElement('tr');

            // Date formatting
            const gameDate = new Date(game.start_ts);

            const formattedDate = gameDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const formattedTime = gameDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            });

            // Opponent
            const opponent = game.opponent_team?.name || 'TBD';

            // Home / Away
            const location = game.home_away === 'home'
                ? 'Home'
                : 'Away';

            // Result
            let result = '';

            if (game.score) {

                const teamScore = game.score.team;
                const opponentScore = game.score.opponent_team;

                const winLoss = teamScore > opponentScore
                    ? 'W'
                    : teamScore < opponentScore
                        ? 'L'
                        : 'T';

                result = `${winLoss} ${teamScore}-${opponentScore}`;

                if (teamScore > opponentScore) {
                    wins++;
                } else if (teamScore < opponentScore) {
                    losses++;
                } else {
                    ties++;
            }

            } else {

                result = 'Upcoming';

            }

            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
                <td>${opponent}</td>
                <td>${location}</td>
                <td>${result}</td>
            `;

            tableBody.appendChild(row);
           const existingRecord = document.getElementById('team-record');

            if (existingRecord) {
                existingRecord.remove();
            }

            const recordDiv = document.createElement('div');

            recordDiv.id = 'team-record';

            recordDiv.style.marginTop = '20px';
            recordDiv.style.fontSize = '24px';
            recordDiv.style.fontWeight = '300';

            recordDiv.innerText = `Record: ${wins} - ${losses} - ${ties}`;

            tableBody.parentElement.appendChild(recordDiv);
        });

    } catch (error) {

        console.error('Error loading schedule:', error);

        const tableBody = document.getElementById('schedule-table-body');

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load schedule.
                </td>
            </tr>
        `;
    }
}

// Load when page opens
document.addEventListener('DOMContentLoaded', loadSchedule);