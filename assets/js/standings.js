$(document).ready(function () {

    function fetchStandings() {

        $.getJSON("assets/json/2026summerstandings.json", function (data) {
            showStandings(data);
        }).fail(function () {
            $("#standings").html("<p>Unable to load standings.</p>");
        });

    }

    fetchStandings();

    function showStandings(data) {

        let html = "";

        data.divisions.forEach(function (division) {

            html += `<h3>${division.name}</h3>`;

            html += `
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <th>W</th>
                            <th>L</th>
                            <th>T</th>
                            <th>PCT</th>
                            <th>GB</th>
                            <th>RF</th>
                            <th>RA</th>
                            <th>RD</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            division.teams.forEach(function (team, index) {

                const highlight = team.name === "DMV Vandals"
                    ? ' class="vandals"'
                    : "";

                html += `
                    <tr${highlight}>
                        <td>${index + 1}</td>
                        <td>${team.name}</td>
                        <td>${team.wins}</td>
                        <td>${team.losses}</td>
                        <td>${team.ties}</td>
                        <td>${team.pct.toFixed(3)}</td>
                        <td>${team.gb}</td>
                        <td>${team.rf}</td>
                        <td>${team.ra}</td>
                        <td>${team.rd}</td>
                    </tr>
                `;

            });

            html += `
                    </tbody>
                </table>
            `;

        });

        $("#standings").html(html);

    }

});