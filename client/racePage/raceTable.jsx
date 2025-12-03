const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

// Table for standings of a specific race
const RaceOverviewTable = () => {
  // Get race data on startup
  const [raceData, setRaceData] = useState();
  useEffect(() => {
    const getRaceData = async () => {
      const response = await fetch('/getRace', {
        method: 'GET',
      });

      const result = await response.json();
      setRaceData(result.race);
    };
    getRaceData();
  }, []);
  return (
    <div>
      {raceData ? (
        <>
          <h2>Finishing Order</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Fin</th>
                  <th>Sta</th>
                  <th>Driver</th>
                  <th>Interval</th>
                  <th>Laps Completed</th>
                  <th>Laps Led</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Loop through each finisher and create row */}
                {raceData.finishPositions.map((driver, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{driver.startPos}</td>
                      <td>{driver.driverName}</td>
                      <td>{driver.interval}</td>
                      <td>{driver.lapsCompleted}</td>
                      <td>{driver.lapsLed}</td>
                      <td>{driver.status}</td>
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
