$(document).ready(function() {
  var sport = 'baseball'; 
  var team = 'dmvvandals'; 
  var password = 'Pa$$word1!'; 

  var dropdownHtml = `
      <select id="leagueSelect">
          <option value="9A1BA060-2FC1-4C7F-B9F6-CB70F122FFBF">2024 Spring/Summer</option>
          <option value="294CA57A-307B-48FB-BD2C-9B8256C0EE13" selected>2024 Spring/Summer Playoffs</option>
      </select>
  `;
  $('#dropdownContainer').html(dropdownHtml);

  var league = $('#leagueSelect').val();

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

  fetchData();

  $('#leagueSelect').change(function() {
    league = $(this).val();
    fetchData();
  });

  function showResults(data) {
    var players = data.PLAYER;

    players = players
      .map(player => player['@attributes'])
      .filter(player => (player.bat_games || 0) > 0);

    var regularPlayers = players.filter(player => player.lastName !== '-');
    var dashPlayers = players.filter(player => player.lastName === '-');

    regularPlayers.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));

    players = regularPlayers.concat(dashPlayers);

    var html = '<table>';
    html += '<thead><tr><th onclick="sortTable(0)">Name</th><th onclick="sortTable(1)">G</th><th onclick="sortTable(2)">PA</th><th onclick="sortTable(3)">AB</th><th onclick="sortTable(4)">R</th><th onclick="sortTable(5)">H</th><th onclick="sortTable(6)">2B</th><th onclick="sortTable(7)">3B</th><th onclick="sortTable(8)">HR</th><th onclick="sortTable(9)">RBI</th><th onclick="sortTable(10)">SB</th><th onclick="sortTable(11)">CS</th><th onclick="sortTable(12)">BB</th><th onclick="sortTable(13)">SO</th><th onclick="sortTable(14)">SOL</th><th onclick="sortTable(15)">BA</th><th onclick="sortTable(16)">OBP</th><th onclick="sortTable(17)">SLG</th><th onclick="sortTable(18)">OPS</th><th onclick="sortTable(19)">TB</th><th onclick="sortTable(20)">GDP</th><th onclick="sortTable(21)">XBH</th><th onclick="sortTable(22)">HBP</th><th onclick="sortTable(23)">SAC</th><th onclick="sortTable(24)">IBB</th><th onclick="sortTable(25)">ROE</th><th onclick="sortTable(26)">LOB</th><th onclick="sortTable(27)">BARISP</th><th onclick="sortTable(28)">BABIP</th></tr></thead><tbody>';

    for (var i = 0; i < regularPlayers.length; i++) {
      var player = regularPlayers[i];
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
      var avg = parseFloat(player.bat_avg || 0).toFixed(3).replace(/^0+/, ''); 
      var obp = parseFloat(player.bat_obp || 0).toFixed(3).replace(/^0+/, ''); 
      var slg = parseFloat(player.bat_slg || 0).toFixed(3).replace(/^0+/, ''); 
      var ops = parseFloat(player.bat_ops || 0).toFixed(3).replace(/^0+/, ''); 
      var tb = player.bat_tb || 0;
      var gidp = player.bat_gidp || 0;
      var xbh = player.bat_xbh || 0;
      var hbp = player.bat_hbp || 0;
      var sac = player.bat_sac || 0;
      var bbi = player.bat_bbi || 0;
      var roe = player.bat_roe || 0;
      var lob = player.bat_lob || 0;
      var risp = parseFloat(player.bat_avg_risp || 0).toFixed(3).replace(/^0+/, ''); 
      var babip = parseFloat(player.bat_babip || 0).toFixed(3).replace(/^0+/, '');

      html += '<tr>';
      html += '<td>' + lastName + ', ' + firstName + '</td>';
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

    html += '</tbody><tfoot><tr>';
    var totalsRow = dashPlayers.find(player => player.lastName === '-');
    if (totalsRow) {
      html += '<td>Totals</td>';
      html += '<td>' + (totalsRow.bat_games || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_pa || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_ab || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_runs || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_hits || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_2b || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_3b || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_hr || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_rbi || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_sb || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_cs || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_bb || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_strikeouts || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_ko_looking || 0) + '</td>';
      html += '<td>' + parseFloat(totalsRow.bat_avg || 0).toFixed(3).replace(/^0+/, '') + '</td>';
      html += '<td>' + parseFloat(totalsRow.bat_obp || 0).toFixed(3).replace(/^0+/, '') + '</td>';
      html += '<td>' + parseFloat(totalsRow.bat_slg || 0).toFixed(3).replace(/^0+/, '') + '</td>';
      html += '<td>' + parseFloat(totalsRow.bat_ops || 0).toFixed(3).replace(/^0+/, '') + '</td>';
      html += '<td>' + (totalsRow.bat_tb || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_gidp || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_xbh || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_hbp || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_sac || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_bbi || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_roe || 0) + '</td>';
      html += '<td>' + (totalsRow.bat_lob || 0) + '</td>';
      html += '<td>' + parseFloat(totalsRow.bat_avg_risp || 0).toFixed(3).replace(/^0+/, '') + '</td>';
      html += '<td>' + parseFloat(totalsRow.bat_babip || 0).toFixed(3).replace(/^0+/, '') + '</td>';
    }
    html += '</tr></tfoot></table>';
    $('#results').html(html);
  }

  var sortDirections = {};

  window.sortTable = function(n) {
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
