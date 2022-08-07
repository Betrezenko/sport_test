'use strict';

const API_URL = 'https://api-football-standings.azharimm.site/leagues'

async function first() {
    const leagueIds = ['eng.1', 'ger.1', 'esp.1', 'fra.1'];

    const leagues = await Promise.all(
        leagueIds.map(id =>
            fetch(`${API_URL}/${id}/standings?season=2021&sort=asc`)
                .then(res => res.json()))
    );

    const teams = leagues.map((league) => league.data.standings[0]);
    
    const result = teams.map(team => {
        const getFromStats = (name) => team.stats.find((stat) => stat.name === name);

        const name = team.team.name;
        const forAvg = (getFromStats("pointsFor").value / getFromStats("gamesPlayed").value).toPrecision(2);
        const againstAvg = (getFromStats("pointsAgainst").value / getFromStats("gamesPlayed").value).toPrecision(2);

        return { name, forAvg, againstAvg };
    });

    console.log(result);
}

first()

async function second() {
    const response = await fetch(`${API_URL}/rus.1/standings?season=2021&sort=asc`);
    const data = await response.json();

    const standings = data.data.standings;
    const transformed = standings.map(team => {
        const { team: teamData, stats } = team;
        const getFromStats = (name) => stats.find((stat) => stat.name === name);

        return {
            name: teamData.name,
            position: getFromStats('rank').value,
            // среднее пропущенных и забитых!!!
            goals: getFromStats('pointsFor').value
        }
    });

    console.log(transformed);
}

second();