$(document).ready(function () {
    // Hardcoded values for sport, team, and password
    var sport = 'baseball'; // Change this to your desired sport
    var team = 'dmvvandals'; // Change this to your team name
    var password = 'Pa$$word1!'; // Change this to your password

    // Create dropdown menu
    var dropdownHtml = `
      <select id="leagueSelect">
          <option value="9A1BA060-2FC1-4C7F-B9F6-CB70F122FFBF">2024 Spring/Summer</option>
          <option value="294CA57A-307B-48FB-BD2C-9B8256C0EE13" selected>2024 Spring/Summer Playoffs</option>
      </select>
  `;
    $('#dropdownContainer').html(dropdownHtml);

    // Set initial league value
    var league = $('#leagueSelect').val();

    // Function to fetch and display data
    function fetchData() {
        $.ajax({
            type: "GET",
            url: "https://api.iscoresports.com/teamwebsite/cumulativestats.php",
            data: { s: sport, t: team, p: password, lg: league, json: "1" },
            dataType: "jsonp",
            success: function (data) {
                showResults(data);
            },
            error: function () {
                alert("An error occurred in the request");
            }
        });
    }

    // Fetch data initially
    fetchData();

    // Update league value and fetch data on dropdown change
    $('#leagueSelect').change(function () {
        league = $(this).val();
        fetchData();
    });

    function showResults(data) {
        var players = data.PLAYER;

        // Filter out players where bgames is 0
        players = players
            .map(player => player['@attributes'])
            .filter(player => (player.pit_games || 0) > 0);

        // Separate players with lastName = '-' and others
        var regularPlayers = players.filter(player => player.lastName !== '-');
        var dashPlayers = players.filter(player => player.lastName === '-');

        // Sort regular players by last name
        regularPlayers.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));

        // Combine the arrays with dashPlayers at the end
        players = regularPlayers.concat(dashPlayers);

        var html = '<table>';
        // Table header
        html += '<thead><tr><th onclick="sortTable(0)">Name</th><th onclick="sortTable(1)">W</th><th onclick="sortTable(2)">L</th><th onclick="sortTable(3)">ERA</th><th onclick="sortTable(4)">G</th><th onclick="sortTable(5)">GS</th><th onclick="sortTable(6)">GF</th><th onclick="sortTable(7)">SV</th><th onclick="sortTable(8)">IP</th><th onclick="sortTable(9)">H</th><th onclick="sortTable(10)">R</th><th onclick="sortTable(11)">ER</th><th onclick="sortTable(12)">HR</th><th onclick="sortTable(13)">BB</th><th onclick="sortTable(14)">IBB</th><th onclick="sortTable(15)">SO</th><th onclick="sortTable(16)">SOL</th><th onclick="sortTable(17)">HBP</th><th onclick="sortTable(18)">BK</th><th onclick="sortTable(19)">BF</th><th onclick="sortTable(20)">FIP</th><th onclick="sortTable(21)">WHIP</th><th onclick="sortTable(22)">SO/W</th><th onclick="sortTable(23)">SO/9</th><th onclick="sortTable(24)">BA</th><th onclick="sortTable(25)">OBP</th><th onclick="sortTable(26)">BABIP</th><th onclick="sortTable(27)">LD%</th><th onclick="sortTable(28)">GB%</th><th onclick="sortTable(29)">FB%</th><th onclick="sortTable(30)">PU%</th></tr></thead><tbody>';

        // Loop through each player
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            var firstName = player.firstName || '';
            var lastName = player.lastName || '';
            var pgames = player.pit_games || 0;
            var win = player.pit_win || 0;
            var loss = player.pit_loss || 0;
            var era = parseFloat(player.pit_era || 0).toFixed(2);
            var gs = player.pit_starts || 0;
            var gf = player.pit_finishes || 0;
            var sv = player.pit_save || 0;
            var ip = player.pit_ip || 0;
            var hit = player.pit_hits || 0;
            var runs = player.pit_runs || 0;
            var er = player.pit_er || 0;
            var hr = player.pit_homeruns || 0;
            var bb = player.pit_walks || 0;
            var ibb = player.pit_int_walks || 0;
            var so = player.pit_strikeouts || 0;
            var sol = player.pit_strikeouts_looking || 0;
            var hbp = player.pit_hit_batters || 0;
            var bk = player.pit_balks || 0;
            var bf = player.pit_bf || 0;
            var fip = parseFloat(player.pit_fip || 0).toFixed(2);
            var whip = parseFloat(player.pit_whip || 0).toFixed(2);
            var kbb = parseFloat(player.pit_strikeout_to_walk || 0).toFixed(2);
            var kp9 = parseFloat(player.pit_k_per_innings || 0).toFixed(2);
            var ba = parseFloat(player.pit_batting_average_against || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
            var obp = parseFloat(player.pit_on_base_percentage || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros	
            var babip = parseFloat(player.pit_babip_against || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
            var ld = parseFloat(player.pit_line_drive_percentage || 0).toFixed(2);
            var gb = parseFloat(player.pit_ground_ball_percentage || 0).toFixed(2);
            var fb = parseFloat(player.pit_fly_ball_percentage || 0).toFixed(2);
            var pu = parseFloat(player.pit_popup_percentage || 0).toFixed(2);

            // Construct table rows
            if (lastName !== '-') { // Exclude totals row from body
                html += '<tr>';
                html += '<td>' + lastName + ', ' + firstName + '</td>';
                html += '<td>' + win + '</td>';
                html += '<td>' + loss + '</td>';
                html += '<td>' + era + '</td>';
                html += '<td>' + pgames + '</td>';
                html += '<td>' + gs + '</td>';
                html += '<td>' + gf + '</td>';
                html += '<td>' + sv + '</td>';
                html += '<td>' + ip + '</td>';
                html += '<td>' + hit + '</td>';
                html += '<td>' + runs + '</td>';
                html += '<td>' + er + '</td>';
                html += '<td>' + hr + '</td>';
                html += '<td>' + bb + '</td>';
                html += '<td>' + ibb + '</td>';
                html += '<td>' + so + '</td>';
                html += '<td>' + sol + '</td>';
                html += '<td>' + hbp + '</td>';
                html += '<td>' + bk + '</td>';
                html += '<td>' + bf + '</td>';
                html += '<td>' + fip + '</td>';
                html += '<td>' + whip + '</td>';
                html += '<td>' + kbb + '</td>';
                html += '<td>' + kp9 + '</td>';
                html += '<td>' + ba + '</td>';
                html += '<td>' + obp + '</td>';
                html += '<td>' + babip + '</td>';
                html += '<td>' + ld + '</td>';
                html += '<td>' + gb + '</td>';
                html += '<td>' + fb + '</td>';
                html += '<td>' + pu + '</td>';
                html += '</tr>';
            }
        }

        html += '</tbody><tfoot><tr>';
        var totalsRow = dashPlayers.find(player => player.lastName === '-');
        if (totalsRow) {
            html += '<td>Totals</td>';
            html += '<td>' + (totalsRow.pit_win || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_loss || 0) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_era || 0).toFixed(2) + '</td>';
            html += '<td>' + (totalsRow.pit_games || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_starts || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_finishes || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_save || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_ip || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_hits || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_runs || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_er || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_homeruns || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_walks || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_int_walks || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_strikeouts || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_strikeouts_looking || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_hit_batters || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_balks || 0) + '</td>';
            html += '<td>' + (totalsRow.pit_bf || 0) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_fip || 0).toFixed(2) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_whip || 0).toFixed(2) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_strikeout_to_walk || 0).toFixed(2) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_k_per_innings || 0).toFixed(2) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_batting_average_against || 0).toFixed(3).replace(/^0+/, '') + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_on_base_percentage || 0).toFixed(3).replace(/^0+/, '') + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_babip_against || 0).toFixed(3).replace(/^0+/, '') + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_line_drive_percentage || 0).toFixed(2) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_ground_ball_percentage || 0).toFixed(2) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_fly_ball_percentage || 0).toFixed(2) + '</td>';
            html += '<td>' + parseFloat(totalsRow.pit_popup_percentage || 0).toFixed(2) + '</td>';
        }

        html += '</tr></tfoot></table>';
        $('#results').html(html);
    }

    var sortDirections = {};

    window.sortTable = function (n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.querySelector("#results table");
        switching = true;

        dir = sortDirections[n] === 'desc' ? 'asc' : 'desc'; // Toggle direction

        sortDirections[n] = dir;

        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                var xContent = isNaN(parseFloat(x.innerHTML)) ? x.innerHTML.toLowerCase() : parseFloat(x.innerHTML);
                var yContent = isNaN(parseFloat(y.innerHTML)) ? y.innerHTML.toLowerCase() : parseFloat(y.innerHTML);
                if (dir == "asc") {
                    if (xContent > yContent) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (xContent < yContent) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }

        // Move Totals row to the bottom
        var totalsRow = Array.from(rows).find(row => row.cells[0].innerText === "Totals");
        if (totalsRow) {
            table.tBodies[0].appendChild(totalsRow);
        }
    };
});
