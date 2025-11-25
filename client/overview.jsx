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
        <table>
          <tr>
            <th>Rank</th>
            <th>Driver</th>
            <th>Points</th>
          </tr>
          {champData.drivers.map((driver, index, arr) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{driver.driverName}</td>
                <td>{driver.pointsPerRace[driver.pointsPerRace.length - 1]}</td>
              </tr>
            );
          })}
        </table>
      ) : (
        <p></p>
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
