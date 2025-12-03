const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

// Creates table of per race data for a driver
const InfoTable = () => {
  // Use states for driver data and champ data
  const [driverData, setDriverData] = useState();
  const [champData, setChampData] = useState();
  // UseEffect to run on component launch
  // Populates driverdata and champdata
  useEffect(() => {
    const getDriverData = async () => {
      const response = await fetch('/getDriver', {
        method: 'GET',
      });

      const result = await response.json();
      setDriverData(result.driverObj);
    };
    getDriverData();
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
      {driverData && champData ? (
        <>
          <h2>Finishing Order</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Race #</th>
                  <th>Track</th>
                  <th>Sta</th>
                  <th>Fin</th>
                  <th>Pts</th>
                  <th>Pts Diff</th>
                </tr>
              </thead>
              <tbody>
                {/* Loops through each finishing position to make rows in table */}
                {driverData.finishPositions.map((finish, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <a href={`/championships/${champData.name}/race/${index + 1}`}>{champData.races[index].trackName}</a>
                      </td>
                      <td>{driverData.startPositions[index]}</td>
                      <td>{finish}</td>
                      <td>{driverData.pointsPerRace[index]}</td>
                      <td>{index === 0 ? 0 : `+ ${driverData.pointsPerRace[index] - driverData.pointsPerRace[index - 1]}`}</td>
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

const infoTableInit = () => {
  const root = createRoot(document.getElementById('driverTable'));
  root.render(<InfoTable />);
};

// window.onload = init;
window.addEventListener('load', infoTableInit);
