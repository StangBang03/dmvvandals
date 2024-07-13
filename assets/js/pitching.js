// batting.js
$(document).ready(function() {
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
      html += '<tr><th>Name</th><th>W</th><th>L</th><th>ERA</th><th>G</th><th>GS</th><th>GF</th><th>SV</th><th>IP</th><th>H</th><th>R</th><th>ER</th><th>HR</th><th>BB</th><th>IBB</th><th>SO</th><th>SOL</th><th>HBP</th><th>BK</th><th>BF</th><th>FIP</th><th>WHIP</th><th>SO/W</th><th>SO/9</th><th>BA</th><th>OBP</th><th>BABIP</th><th>LD%</th><th>GB%</th><th>FB%</th><th>PU%</th></tr>';
  
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
        var gf = player.bat_finishes || 0;
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
	var ba = parseFloat(player.pit_batting_average_against|| 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
	var obp = parseFloat(player.pit_on_base_percentage|| 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros	
	var babip = parseFloat(player.pit_babip_against|| 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
        var ld = parseFloat(player.pit_line_drive_percentage || 0).toFixed(2);       
        var gb = parseFloat(player.pit_ground_ball_percentage || 0).toFixed(2);
        var fb = parseFloat(player.pit_fly_ball_percentage || 0).toFixed(2);
	var pu = parseFloat(player.pit_popup_percentage || 0).toFixed(2);

        // Construct table rows
        html += '<tr>';
        html += '<td>' + (lastName === '-' ? 'Totals' : lastName + ', ' + firstName) + '</td>';
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
  
      html += '</table>';
      $('#results').html(html);
    } 
  });