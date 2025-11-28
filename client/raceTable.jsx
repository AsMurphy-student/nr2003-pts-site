const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

const RaceTable = () => {
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
          <h2>Standings after {champData.races.length} Races</h2>
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
                {champData.races.map((race, index, arr) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>Need to add race name</td>
                      <td>{race.finishPositions[0].lapsCompleted}</td>
                      <td>{race.finishPositions[0].driverName}</td>
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
