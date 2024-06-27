// batting.js
$(document).ready(function() {
    // Hardcoded values for sport, team, and password
    var sport = 'baseball'; // Change this to your desired sport
    var team = 'dmvvandals'; // Change this to your team name
    var password = 'Pa$$word1!'; // Change this to your password
  
    // Initial data retrieval and table rendering
    $.ajax({
      type: "GET",
      url: "http://api.iscoresports.com/teamwebsite/cumulativestats.php",
      data: { s: sport, t: team, p: password, json: "1" },
      dataType: "jsonp",
      success: function(data) {
        showResults(data);
      },
      error: function() {
        alert("An error occurred in the request");
      }
    });
  
    function showResults(data) {
      var players = data.PLAYER;
      
      // Filter out players where bgames is 0
      players = players
        .map(player => player['@attributes'])
        .filter(player => (player.bat_games || 0) > 0);
  
      // Separate players with lastName = '-' and others
      var regularPlayers = players.filter(player => player.lastName !== '-');
      var dashPlayers = players.filter(player => player.lastName === '-');
  
      // Sort regular players by last name
      regularPlayers.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
  
      // Combine the arrays with dashPlayers at the end
      players = regularPlayers.concat(dashPlayers);
  
      var html = '<table>';
      // Table header
      html += '<tr><th>Name</th><th>G</th><th>PA</th><th>AB</th><th>R</th><th>H</th><th>2B</th><th>3B</th><th>HR</th><th>RBI</th><th>SB</th><th>CS</th><th>BB</th><th>SO</th><th>SOL</th><th>BA</th><th>OBP</th><th>SLG</th><th>OPS</th><th>TB</th><th>GDP</th><th>XBH</th><th>HBP</th><th>SAC</th><th>IBB</th><th>ROE</th><th>LOB</th><th>BARISP</th><th>BABIP</th></tr>';
  
      // Loop through each player
      for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var firstName = player.firstName || '';
        var lastName = player.lastName || '';
        var bgames = player.bat_games || 0;
        var pa = player.bat_pa || 0;
        var ab = player.bat_ab || 0;
        var runs = player.bat_runs || 0;
        var hits = player.bat_hits || 0;
        var b2 = player.bat_2b || 0;
        var b3 = player.bat_3b || 0;
        var hr = player.bat_hr || 0;
        var rbi = player.bat_rbi || 0;
        var sb = player.bat_sb || 0;
        var cs = player.bat_cs || 0;
        var bb = player.bat_bb || 0;
        var so = player.bat_strikeouts || 0;
        var kl = player.bat_ko_looking || 0;
        var avg = parseFloat(player.bat_avg || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
        var obp = parseFloat(player.bat_obp || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
        var slg = parseFloat(player.bat_slg || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
        var ops = parseFloat(player.bat_ops || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
        var tb = player.bat_tb || 0;
        var gidp = player.bat_gidp || 0;
        var xbh = player.bat_xbh || 0;
        var hbp = player.bat_hbp || 0;
        var sac = player.bat_sac || 0;
        var bbi = player.bat_bbi || 0;
        var roe = player.bat_roe || 0;
        var lob = player.bat_lob || 0;
        var risp = parseFloat(player.bat_avg_risp || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
        var babip = parseFloat(player.bat_babip || 0).toFixed(3).replace(/^0+/, ''); // Remove leading zeros
  
        // Construct table rows
        html += '<tr>';
        html += '<td>' + (lastName === '-' ? 'Totals' : lastName + ', ' + firstName) + '</td>';
        html += '<td>' + bgames + '</td>';
        html += '<td>' + pa + '</td>';
        html += '<td>' + ab + '</td>';
        html += '<td>' + runs + '</td>';
        html += '<td>' + hits + '</td>';
        html += '<td>' + b2 + '</td>';
        html += '<td>' + b3 + '</td>';
        html += '<td>' + hr + '</td>';
        html += '<td>' + rbi + '</td>';
        html += '<td>' + sb + '</td>';
        html += '<td>' + cs + '</td>';
        html += '<td>' + bb + '</td>';
        html += '<td>' + so + '</td>';
        html += '<td>' + kl + '</td>';
        html += '<td>' + avg + '</td>';
        html += '<td>' + obp + '</td>';
        html += '<td>' + slg + '</td>';
        html += '<td>' + ops + '</td>';
        html += '<td>' + tb + '</td>';
        html += '<td>' + gidp + '</td>';
        html += '<td>' + xbh + '</td>';
        html += '<td>' + hbp + '</td>';
        html += '<td>' + sac + '</td>';
        html += '<td>' + bbi + '</td>';
        html += '<td>' + roe + '</td>';
        html += '<td>' + lob + '</td>';
        html += '<td>' + risp + '</td>';
        html += '<td>' + babip + '</td>';
        html += '</tr>';
      }
  
      html += '</table>';
      $('#results').html(html);
    } 
  });