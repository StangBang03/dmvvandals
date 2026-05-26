$(document).ready(function () {

    // JSON file location
    const scheduleFile = 'assets/json/2026summerschedule.json';

    // Load schedule data
    function fetchData() {
        $.getJSON(scheduleFile, function (data) {
            showResults(data);
        }).fail(function () {
            alert('An error occurred loading the schedule JSON file.');
        });
    }

    // Initial load
    fetchData();

    function showResults(data) {

        // Pull events array from GameChanger export
        let gameList = data.data.events || [];

        // Sort games by date ascending
        gameList.sort(function (a, b) {
            return new Date(a.start_ts) - new Date(b.start_ts);
        });

        let html = '<table>';
        html += '<tr><th>Date</th><th>Matchup</th><th>Score</th><th>Result</th></tr>';

        let wins = 0;
        let losses = 0;
        let ties = 0;

        gameList.forEach(function (game) {

            // Format date
            const gameDate = new Date(game.start_ts);

            const formattedDate =
                (gameDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                gameDate.getDate().toString().padStart(2, '0') + '/' +
                gameDate.getFullYear().toString().slice(-2);

            // Opponent/team names
            const opponent = game.opponent_team?.name || 'TBD';

            const matchup =
                game.home_away === 'home'
                    ? 'vs. ' + opponent
                    : '@ ' + opponent;

            // Scores
            let scoreText = '-';
            let resultText = 'Upcoming';

            if (game.score) {

                const teamScore = game.score.team ?? 0;
                const oppScore = game.score.opponent_team ?? 0;

                scoreText = `${teamScore} - ${oppScore}`;

                if (teamScore > oppScore) {
                    resultText = 'Win';
                    wins++;
                }
                else if (teamScore < oppScore) {
                    resultText = 'Loss';
                    losses++;
                }
                else {
                    resultText = 'Tie';
                    ties++;
                }
            }

            html += '<tr>';
            html += '<td>' + formattedDate + '</td>';
            html += '<td>' + matchup + '</td>';
            html += '<td>' + scoreText + '</td>';
            html += '<td>' + resultText + '</td>';
            html += '</tr>';

        });

        html += '</table>';

        // Record display
        const recordHtml =
            '<div id="resultsText">' +
            '&nbsp;Record: ' +
            wins + ' - ' + losses + ' - ' + ties +
            '</div>';

        $('#results').html(html + recordHtml);
    }

    // Keep same styling behavior
    const css =
        '<style>' +
        '#resultsText {' +
        'text-align: left;' +
        'margin-top: 10px;' +
        '}' +
        '</style>';

    $('head').append(css);

});