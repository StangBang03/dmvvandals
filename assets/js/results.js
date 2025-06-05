$(document).ready(function() {
    // Hardcoded values for sport, team, and password
    var sport = 'baseball'; // Change this to your desired sport
    var team = 'dmvvandals'; // Change this to your team name
    var password = 'Pa$$word1!'; // Change this to your password

    // Create dropdown menu
    var dropdownHtml = `
        <select id="leagueSelect">
            <option value="ALL">Cumulative Record</option>
	    <option value="35046DD7-73E7-47AE-809C-5A5365670EFA" selected>2025 Spring/Summer</option>
            <option value="9A1BA060-2FC1-4C7F-B9F6-CB70F122FFBF">2024 Spring/Summer</option>
            <option value="294CA57A-307B-48FB-BD2C-9B8256C0EE13">2024 Spring/Summer Playoffs</option>
        </select>
    `;
    $('#dropdownContainer').html(dropdownHtml);

    // Set initial league value
    var league = $('#leagueSelect').val();

    // Initial data retrieval and table rendering
    function fetchData(){
        $.ajax({
            type: "GET",
            url: "https://api.iscoresports.com/teamwebsite/games.php",
            data: { s: sport, t: team, p: password, lg: league},
            dataType: "jsonp",
            success: function(data) {
                showResults(data);
            },
            error: function() {
                alert("An error occurred in the request");
            }
        });
    }
    
    // Fetch data initially
    fetchData();

    // Update league value and fetch data on dropdown change
    $('#leagueSelect').change(function() {
        league = $(this).val();
        fetchData();
    });

function showResults(data) {
    var games = $(data).find('GAME');

    // Collect game data into an array for sorting
    var gameList = [];

    games.each(function () {
        var game = $(this);
        gameList.push({
            scheduled: parseInt(game.attr('scheduled')), // Unix timestamp
            nameWithDate: game.attr('name') || '',
            visitor: game.attr('visitor') || '',
            home: game.attr('home') || '',
            visitorScore: parseInt(game.attr('visitorScore')) || 0,
            homeScore: parseInt(game.attr('homeScore')) || 0,
            result: game.attr('result') || ''
        });
    });

    // Sort by scheduled timestamp (ascending)
    gameList.sort(function (a, b) {
        return a.scheduled - b.scheduled;
    });

    var html = '<table>';
    html += '<tr><th>Date</th><th>Matchup</th><th>Score</th><th>Result</th></tr>';

    var wins = 0, losses = 0, ties = 0;

    gameList.forEach(function (game) {
        var nameParts = game.nameWithDate.match(/(\d{1,2}\/\d{1,2}\/\d{2})\s+(.+)/);
        var date = nameParts ? nameParts[1] : '';
        var name = nameParts ? nameParts[2] : game.nameWithDate;

        // Update counters based on the result
        if (game.result.toLowerCase() === 'win') {
            wins++;
        } else if (game.result.toLowerCase() === 'loss') {
            losses++;
        } else if (game.result.toLowerCase() === 'tie') {
            ties++;
        }

        html += '<tr>';
        html += '<td>' + date + '</td>';
        html += '<td>' + name + '</td>';
        html += '<td>' + (game.visitorScore + ' - ' + game.homeScore) + '</td>';
        html += '<td>' + game.result + '</td>';
        html += '</tr>';
    });

    html += '</table>';

    var resultText = '<div id="resultsText">' + '&nbsp;' + 'Record: ' + wins + ' - ' + losses + ' - ' + ties + '</div>';
    $('#results').html(html + resultText);
}


    // Add CSS for left-aligning the results and adding a margin
    var css = '<style>#resultsText { text-align: left; margin-top: 10px; }</style>';
    $('head').append(css);
});
