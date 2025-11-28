const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

const RaceOverviewTable = () => {
  const [raceData, setRaceData] = useState();
  useEffect(() => {
    const getRaceData = async () => {
      const response = await fetch('/getRace', {
        method: 'GET',
      });

      const result = await response.json();
      console.log(result.race);
      setRaceData(result.race);
    };
    getRaceData();
  }, []);
  return (
    <div>
      {/* <button onClick={() => console.log(champData.drivers)}>Test</button>*/}
      {raceData ? (
        <>
          <h2>Race Overview</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Driver</th>
                </tr>
              </thead>
              <tbody>
                {raceData.finishPositions.map((driver, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{driver.driverName}</td>
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

const raceOverviewInit = () => {
  const root = createRoot(document.getElementById('raceTable'));
  root.render(<RaceOverviewTable />);
};

// window.onload = init;
window.addEventListener('load', raceOverviewInit);
