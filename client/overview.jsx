const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

const Table = () => {
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
      {/* <button onClick={() => console.log(champData.drivers)}>Test</button>*/}
      {champData ? (
        <>
          <h2>Standings after {champData.races.length} Races</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Driver</th>
                  <th>Points</th>
                  <th>Next</th>
                  <th>Ldr</th>
                  <th>Starts</th>
                  <th>Poles</th>
                  <th>Wins</th>
                  <th>Top5</th>
                  <th>Top10</th>
                  <th>Top15</th>
                  <th>Top20</th>
                  <th>DNFs</th>
                  <th>Races Led</th>
                  <th>Laps Led</th>
                  <th>Laps Completed</th>
                  <th>Avg Sta</th>
                  <th>Avg Fin</th>
                </tr>
              </thead>
              <tbody>
                {champData.drivers.map((driver, index, arr) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{driver.driverName}</td>
                      <td>
                        {driver.pointsPerRace[driver.pointsPerRace.length - 1]}
                      </td>
                      <td>
                        {index != 0
                          ? arr[index - 1].pointsPerRace[
                              arr[index - 1].pointsPerRace.length - 1
                            ] -
                            driver.pointsPerRace[driver.pointsPerRace.length - 1]
                          : 0}
                      </td>
                      <td>
                        {index != 0
                          ? arr[0].pointsPerRace[
                              arr[0].pointsPerRace.length - 1
                            ] -
                            driver.pointsPerRace[driver.pointsPerRace.length - 1]
                          : 0}
                      </td>
                      <td>{driver.starts}</td>
                      <td>{driver.poles}</td>
                      <td>{driver.wins}</td>
                      <td>{driver.top5}</td>
                      <td>{driver.top10}</td>
                      <td>{driver.top15}</td>
                      <td>{driver.top20}</td>
                      <td>{driver.dnfs}</td>
                      <td>{driver.racesLed}</td>
                      <td>{driver.lapsLed}</td>
                      <td>{driver.lapsCompleted}</td>
                      <td>{driver.avgStart}</td>
                      <td>{driver.avgFinish}</td>
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

const tableInit = () => {
  const root = createRoot(document.getElementById('overviewTable'));
  root.render(<Table />);
};

// window.onload = init;
window.addEventListener('load', tableInit);
