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

        var html = '<table>';
        // Table header
        html += '<tr><th>Date</th><th>Matchup<th>Score</th><th>Result</th></tr>';

        // Counters for wins, losses, and ties
        var wins = 0;
        var losses = 0;
        var ties = 0;

        // Loop through each game
        games.each(function() {
            var game = $(this);
            var nameWithDate = game.attr('name') || '';
            var visitor = game.attr('visitor') || '';
            var home = game.attr('home') || '';
            var visitorScore = parseInt(game.attr('visitorScore')) || 0;
            var homeScore = parseInt(game.attr('homeScore')) || 0;
            var result = game.attr('result') || '';

            // Extract date from the beginning of the name using regex
            var nameParts = nameWithDate.match(/(\d{1,2}\/\d{1,2}\/\d{2})\s+(.+)/);
            var date = nameParts ? nameParts[1] : '';
            var name = nameParts ? nameParts[2] : nameWithDate;

            // Update counters based on the result
            if (result.toLowerCase() === 'win') {
                wins++;
            } else if (result.toLowerCase() === 'loss') {
                losses++;
            } else if (result.toLowerCase() === 'tie') {
                ties++;
            }

            // Construct table rows
            html += '<tr>';
            html += '<td>' + date + '</td>';
            html += '<td>' + name + '</td>';
            html += '<td>' + (visitorScore + ' - ' + homeScore) + '</td>';
            html += '<td>' + result + '</td>';
            html += '</tr>';
        });

        html += '</table>';

        // Display the results in the desired format
        var resultText = '<div id="resultsText">' + '&nbsp;' + 'Record: ' + wins + ' - ' + losses + ' - ' + ties + '</div>';
        $('#results').html(html + resultText);
    }

    // Add CSS for left-aligning the results and adding a margin
    var css = '<style>#resultsText { text-align: left; margin-top: 10px; }</style>';
    $('head').append(css);
});
