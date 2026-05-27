$(document).ready(function () {

    function fetchStandings() {

        const standingsUrl =
    		"https://corsproxy.io/?https://se-api.sportsengine.com/v3/microsites/season_team_stats?program_id=69573a60e40fdb358ad519b1";

        $.getJSON(standingsUrl, function (data) {
            showStandings(data);

        })

    // Initial load
    fetchStandings();

    function showStandings(data) {

        let standings = data.result || [];

        // Build standings array
        let teams = standings.map(function (team) {

            const scoring = team.values?.baseball_team_scoring || {};

            const wins = parseInt(scoring.wins || 0);
            const losses = parseInt(scoring.losses || 0);
            const ties = parseInt(scoring.ties || 0);
            const runs = parseInt(scoring.runs || 0);

            const gamesPlayed = wins + losses + ties;

            // Tie counts as half win
            const pct = gamesPlayed > 0
                ? ((wins + (ties * 0.5)) / gamesPlayed).toFixed(3)
                : ".000";

            return {
                team: team.team_name.trim(),
                wins: wins,
                losses: losses,
                ties: ties,
                pct: pct,
                runs: runs
            };

        });

        // Sort by winning percentage descending
        teams.sort(function (a, b) {
            return parseFloat(b.pct) - parseFloat(a.pct);
        });

        // Build table
        let html = '<table>';
        html += `
            <tr>
                <th>#</th>
                <th>Team</th>
                <th>W</th>
                <th>L</th>
                <th>T</th>
                <th>PCT</th>
                <th>RS</th>
            </tr>
        `;

        teams.forEach(function (team, index) {

            html += '<tr>';

            html += '<td>' + (index + 1) + '</td>';
            html += '<td>' + team.team + '</td>';
            html += '<td>' + team.wins + '</td>';
            html += '<td>' + team.losses + '</td>';
            html += '<td>' + team.ties + '</td>';
            html += '<td>' + team.pct + '</td>';
            html += '<td>' + team.runs + '</td>';

            html += '</tr>';

        });

        html += '</table>';

        $('#standings').html(html);
    }

});