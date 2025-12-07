const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

// Table of races in a season for the overview page
const RaceTable = () => {
  // Get champ data on component load
  const [champData, setChampData] = useState();
  useEffect(() => {
    const getChampionshipData = async () => {
      const response = await fetch('/getChampionship', {
        method: 'GET',
      });

      const result = await response.json();
      setChampData(result.championshipData);
    };
    getChampionshipData();
  }, []);
  return (
    <div>
      {champData ? (
        <>
          <h2>Info per Race</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Num</th>
                  <th>Track Name</th>
                  <th>Number of Laps</th>
                  <th>Race Winner</th>
                </tr>
              </thead>
              <tbody>
                {/* Loop through each race and create row for race */}
                {champData.races.map((race, index, arr) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <a href={`/championships/${champData.name}/race/${index + 1}`}>{race.trackName}</a>
                      </td>
                      <td>{race.finishPositions[0].lapsCompleted}</td>
                      <td>
                        <a href={`/championships/${champData.name}/driver/${race.finishPositions[0].driverName.toLowerCase().replace(' ', '-')}`}>{race.finishPositions[0].driverName}</a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className='fetching-tag-container'>
          <h3>Fetching data...</h3>
        </div>
      )}
    </div>
  );
};

const raceTableInit = () => {
  const root = createRoot(document.getElementById('raceTable'));
  root.render(<RaceTable />);
};

window.addEventListener('load', raceTableInit);
