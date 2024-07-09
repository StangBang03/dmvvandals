$(document).ready(function() {
    // Hardcoded values for sport, team, and password
    var sport = 'baseball'; // Change this to your desired sport
    var team = 'dmvvandals'; // Change this to your team name
    var password = 'Pa$$word1!'; // Change this to your password
  
    // Initial data retrieval and table rendering
    $.ajax({
      type: "GET",
      url: "https://api.iscoresports.com/teamwebsite/games.php",
      data: { s: sport, t: team, p: password },
      dataType: "jsonp",
      success: function(data) {
        showResults(data);
      },
      error: function() {
        alert("An error occurred in the request");
      }
    });
  
    function showResults(data) {
      var games = $(data).find('GAME');
      
      var html = '<table>';
      // Table header
      html += '<tr><th>Date</th><th>Visitor</th><th>Home</th><th>Visitor Score</th><th>Home Score</th><th>Result</th></tr>';
  
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
        //html += '<td>' + name + '</td>';
        html += '<td>' + visitor + '</td>';
        html += '<td>' + home + '</td>';
        html += '<td>' + visitorScore + '</td>';
        html += '<td>' + homeScore + '</td>';
        html += '<td>' + result + '</td>';
        html += '</tr>';
      });
  
      html += '</table>';
      $('#results').html(html);
    } 
});
