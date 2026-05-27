$(document).ready(function() {

  var sport = 'baseball';
  var team = 'dmvvandals';
  var password = 'Pa$$word1!';

  var dropdownHtml = `
      <select id="leagueSelect">
          <!-- <option value="ALL">Cumulative Stats</option> -->

          <!-- GAMECHANGER JSON SEASONS -->
          <option value="assets/json/2026summerbattingstats.json" selected>2026 Spring/Summer</option>
          <option value="assets/json/2025fallbattingstats.json">2025 Fall</option>

          <!-- ISCORE SEASONS -->
          <option value="B1A52520-0CF5-4384-8B82-0DFF4327885C">2025 Spring/Summer Playoffs</option>
          <option value="35046DD7-73E7-47AE-809C-5A5365670EFA">2025 Spring/Summer</option>
          <option value="assets/json/2024fallbattingstats.json">2024 Fall</option>
          <option value="294CA57A-307B-48FB-BD2C-9B8256C0EE13">2024 Spring/Summer Playoffs</option>
          <option value="9A1BA060-2FC1-4C7F-B9F6-CB70F122FFBF">2024 Spring/Summer</option>
      </select>
  `;

  $('#dropdownContainer').html(dropdownHtml);

  var league = $('#leagueSelect').val();

  fetchData();

  $('#leagueSelect').change(function() {
    league = $(this).val();
    fetchData();
  });

  /*
  ==========================================
  MAIN FETCH ROUTER
  ==========================================
  */

  function fetchData() {

    if (league.endsWith('.json')) {
      fetchGameChangerData(league);
    } else {
      fetchIScoreData();
    }
  }

  /*
  ==========================================
  ISCORE DATA
  ==========================================
  */

  function fetchIScoreData() {

    $.ajax({
      type: "GET",
      url: "https://api.iscoresports.com/teamwebsite/cumulativestats.php",
      data: {
        s: sport,
        t: team,
        p: password,
        lg: league,
        json: "1"
      },
      dataType: "jsonp",

      success: function(data) {
        showIScoreResults(data);
      },

      error: function() {
        alert("An error occurred in the iScore request");
      }
    });
  }

  function showIScoreResults(data) {

    var players = data.PLAYER;

    players = players
      .map(player => player['@attributes'])
      .filter(player => (player.bat_games || 0) > 0);

    var regularPlayers = players.filter(player => player.lastName !== '-');

    regularPlayers.sort((a, b) =>
      (a.lastName || '').localeCompare(b.lastName || '')
    );

    var html = '<table>';

    html += `
      <thead>
        <tr>
          <th onclick="sortTable(0)">Name</th>
          <th onclick="sortTable(1)">G</th>
          <th onclick="sortTable(2)">PA</th>
          <th onclick="sortTable(3)">AB</th>
          <th onclick="sortTable(4)">R</th>
          <th onclick="sortTable(5)">H</th>
          <th onclick="sortTable(6)">2B</th>
          <th onclick="sortTable(7)">3B</th>
          <th onclick="sortTable(8)">HR</th>
          <th onclick="sortTable(9)">RBI</th>
          <th onclick="sortTable(10)">SB</th>
          <th onclick="sortTable(11)">CS</th>
          <th onclick="sortTable(12)">BB</th>
          <th onclick="sortTable(13)">SO</th>
          <th onclick="sortTable(14)">SOL</th>
          <th onclick="sortTable(15)">BA</th>
          <th onclick="sortTable(16)">OBP</th>
          <th onclick="sortTable(17)">SLG</th>
          <th onclick="sortTable(18)">OPS</th>
          <th onclick="sortTable(19)">TB</th>
          <th onclick="sortTable(20)">GDP</th>
          <th onclick="sortTable(21)">XBH</th>
          <th onclick="sortTable(22)">HBP</th>
          <th onclick="sortTable(23)">SAC</th>
          <th onclick="sortTable(24)">ROE</th>
          <th onclick="sortTable(25)">LOB</th>
          <th onclick="sortTable(26)">BARISP</th>
          <th onclick="sortTable(27)">BABIP</th>
        </tr>
      </thead>
      <tbody>
    `;

    for (var i = 0; i < regularPlayers.length; i++) {

      var player = regularPlayers[i];

      html += '<tr>';

      html += `<td>${player.lastName}, ${player.firstName}</td>`;
      html += `<td>${player.bat_games || 0}</td>`;
      html += `<td>${player.bat_pa || 0}</td>`;
      html += `<td>${player.bat_ab || 0}</td>`;
      html += `<td>${player.bat_runs || 0}</td>`;
      html += `<td>${player.bat_hits || 0}</td>`;
      html += `<td>${player.bat_2b || 0}</td>`;
      html += `<td>${player.bat_3b || 0}</td>`;
      html += `<td>${player.bat_hr || 0}</td>`;
      html += `<td>${player.bat_rbi || 0}</td>`;
      html += `<td>${player.bat_sb || 0}</td>`;
      html += `<td>${player.bat_cs || 0}</td>`;
      html += `<td>${player.bat_bb || 0}</td>`;
      html += `<td>${player.bat_strikeouts || 0}</td>`;
      html += `<td>${player.bat_ko_looking || 0}</td>`;
      html += `<td>${parseFloat(player.bat_avg || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${parseFloat(player.bat_obp || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${parseFloat(player.bat_slg || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${parseFloat(player.bat_ops || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${player.bat_tb || 0}</td>`;
      html += `<td>${player.bat_gidp || 0}</td>`;
      html += `<td>${player.bat_xbh || 0}</td>`;
      html += `<td>${player.bat_hbp || 0}</td>`;
      html += `<td>${player.bat_sac || 0}</td>`;
      html += `<td>${player.bat_roe || 0}</td>`;
      html += `<td>${player.bat_lob || 0}</td>`;
      html += `<td>${parseFloat(player.bat_avg_risp || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${parseFloat(player.bat_babip || 0).toFixed(3).replace(/^0+/, '')}</td>`;

      html += '</tr>';
    }

    html += '</tbody></table>';

    $('#results').html(html);
  }

  /*
  ==========================================
  GAMECHANGER DATA
  ==========================================
  */

  function fetchGameChangerData(jsonFile) {

    fetch(jsonFile)
      .then(response => response.json())
      .then(data => {
        showGameChangerResults(data);
      })
      .catch(error => {
        console.error(error);
        alert("Failed to load GameChanger stats");
      });
  }

  function showGameChangerResults(data) {

    var players = data.players;

    players = players.filter(player =>
      (player.stats.g || 0) > 0
    );

    players.sort((a, b) =>
      (a.last || '').localeCompare(b.last || '')
    );

    var html = '<table>';

    html += `
      <thead>
        <tr>
          <th onclick="sortTable(0)">Name</th>
          <th onclick="sortTable(1)">G</th>
          <th onclick="sortTable(2)">PA</th>
          <th onclick="sortTable(3)">AB</th>
          <th onclick="sortTable(4)">R</th>
          <th onclick="sortTable(5)">H</th>
          <th onclick="sortTable(6)">2B</th>
          <th onclick="sortTable(7)">3B</th>
          <th onclick="sortTable(8)">HR</th>
          <th onclick="sortTable(9)">RBI</th>
          <th onclick="sortTable(10)">SB</th>
          <th onclick="sortTable(11)">CS</th>
          <th onclick="sortTable(12)">BB</th>
          <th onclick="sortTable(13)">SO</th>
          <th onclick="sortTable(14)">SOL</th>
          <th onclick="sortTable(15)">BA</th>
          <th onclick="sortTable(16)">OBP</th>
          <th onclick="sortTable(17)">SLG</th>
          <th onclick="sortTable(18)">OPS</th>
          <th onclick="sortTable(19)">TB</th>
          <th onclick="sortTable(20)">GDP</th>
          <th onclick="sortTable(21)">XBH</th>
          <th onclick="sortTable(22)">HBP</th>
          <th onclick="sortTable(23)">SAC</th>
          <th onclick="sortTable(24)">ROE</th>
          <th onclick="sortTable(25)">LOB</th>
          <th onclick="sortTable(26)">BARISP</th>
          <th onclick="sortTable(27)">BABIP</th>
        </tr>
      </thead>
      <tbody>
    `;

    players.forEach(player => {

      var s = player.stats;

      html += '<tr>';

      html += `<td>${player.last}, ${player.first}</td>`;
      html += `<td>${s.g || 0}</td>`;
      html += `<td>${s.pa || 0}</td>`;
      html += `<td>${s.ab || 0}</td>`;
      html += `<td>${s.r || 0}</td>`;
      html += `<td>${s.h || 0}</td>`;
      html += `<td>${s["2b"] || 0}</td>`;
      html += `<td>${s["3b"] || 0}</td>`;
      html += `<td>${s.hr || 0}</td>`;
      html += `<td>${s.rbi || 0}</td>`;
      html += `<td>${s.sb || 0}</td>`;
      html += `<td>${s.cs || 0}</td>`;
      html += `<td>${s.bb || 0}</td>`;
      html += `<td>${s.so || 0}</td>`;
      html += `<td>${s.sol || 0}</td>`;
      html += `<td>${Number(s.ba || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${Number(s.obp || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${Number(s.slg || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${Number(s.ops || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${s.tb || 0}</td>`;
      html += `<td>${s.gdp || 0}</td>`;
      html += `<td>${s.xbh || 0}</td>`;
      html += `<td>${s.hbp || 0}</td>`;
      html += `<td>${s.sac || 0}</td>`;
      html += `<td>${s.roe || 0}</td>`;
      html += `<td>${s.lob || 0}</td>`;
      html += `<td>${Number(s.barisp || 0).toFixed(3).replace(/^0+/, '')}</td>`;
      html += `<td>${Number(s.babip || 0).toFixed(3).replace(/^0+/, '')}</td>`;

      html += '</tr>';
    });

    html += '</tbody></table>';

    $('#results').html(html);
  }

  /*
  ==========================================
  SORTING
  ==========================================
  */

  var sortDirections = {};

  window.sortTable = function(n) {

    var table, rows, switching, i, x, y, shouldSwitch;
    var dir, switchcount = 0;

    table = document.querySelector("#results table");

    switching = true;

    dir = sortDirections[n] === 'desc' ? 'asc' : 'desc';

    sortDirections[n] = dir;

    while (switching) {

      switching = false;

      rows = table.rows;

      for (i = 1; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        var xContent = isNaN(parseFloat(x.innerHTML))
          ? x.innerHTML.toLowerCase()
          : parseFloat(x.innerHTML);

        var yContent = isNaN(parseFloat(y.innerHTML))
          ? y.innerHTML.toLowerCase()
          : parseFloat(y.innerHTML);

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
  };

});