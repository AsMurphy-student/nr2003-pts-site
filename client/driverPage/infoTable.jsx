const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');

const InfoTable = () => {
  const [driverData, setDriverData] = useState();
  const [champData, setChampData] = useState();
  useEffect(() => {
    const getDriverData = async () => {
      const response = await fetch('/getDriver', {
        method: 'GET',
      });

      const result = await response.json();
      setDriverData(result.race);
    };
    // getDriverData();
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
      {/* <button onClick={() => console.log(champData.drivers)}>Return to Overview</button>*/}
      {driverData ? (
        <>
          <h2>Finishing Order</h2>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Race</th>
                  <th>Sta</th>
                  <th>Fin</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {driverData.finishPositions.map((finish, index) => {
                  return (
                    <tr>
                      <td>Need to add</td>
                      <td>Need to add</td>
                      <td>Need to add</td>
                      <td>Need to add</td>
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
