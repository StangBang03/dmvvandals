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
  
      // Loop through each game
      games.each(function() {
        var game = $(this);
        var nameWithDate = game.attr('name') || '';
        console.log("Name with Date:", nameWithDate);  // Log the nameWithDate to check its format

        var visitor = game.attr('visitor') || '';
        var home = game.attr('home') || '';
        var visitorScore = game.attr('visitorScore') || 0;
        var homeScore = game.attr('homeScore') || 0;
        var result = game.attr('result') || '';

        // Extract date from the beginning of the name using regex
        var nameParts = nameWithDate.match(/(\d{1,2}\/\d{1,2}\/\d{2})\s+(.+)/);
        var date = nameParts ? nameParts[1] : '';
        var name = nameParts ? nameParts[2] : nameWithDate;
        console.log("Extracted Name:", name);  // Log the extracted name
        console.log("Extracted Date:", date);  // Log the extracted date
  
        // Construct table rows
        html += '<tr>';
        html += '<td>' + date + '</td>';
        html += '<td>' + name + '</td>';
        html += '<td>' + (visitorScore + ' - ' + homeScore) + '</td>';
        html += '<td>' + result + '</td>';
        html += '</tr>';
      });
  
      html += '</table>';
      $('#results').html(html);
    } 
});
