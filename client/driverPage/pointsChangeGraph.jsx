const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

const DriverPointsChangeGraph = () => {
  let driverData;
  let champData;
  const [lineData, setLineData] = useState();
  const [driverName, setDriverName] = useState('');
  useEffect(async () => {
    const getDriverData = async () => {
      const response = await fetch('/getDriver', {
        method: 'GET',
      });

      const result = await response.json();
      driverData = result.driverObj;
    };
    await getDriverData();
    const getChampionshipData = async () => {
      const response = await fetch('/getChampionship', {
        method: 'GET',
      });

      const result = await response.json();
      champData = result.championshipData;
    };
    await getChampionshipData();

    // const driverIndex = champData.drivers.findIndex(
    //   (driver) => driver.driverName === driverData.driverName,
    // );

    // if (driverIndex > 0 && driverIndex < champData.drivers.length - 1) {
    //   setDriversPointsArray([
    //     champData.drivers[driverIndex - 1],
    //     driverData,
    //     champData.drivers[driverIndex + 1],
    //   ]);
    // } else if (driverIndex === 0) {
    //   setDriversPointsArray([
    //     driverData,
    //     champData.drivers[driverIndex + 1],
    //     champData.drivers[driverIndex + 2],
    //   ]);
    // } else {
    //   setDriversPointsArray([
    //     champData.drivers[driverIndex - 2],
    //     champData.drivers[driverIndex - 1],
    //     driverData,
    //   ]);
    // }
    setLineData(
      driverData.pointsPerRace.map((point, index, arr) => {
        if (index > 0) {
          return {[`${driverData.driverName}`]: point - arr[index - 1]};
        }
      })
    );
    setDriverName(driverData.driverName);
  }, []);
  return (
    <div>
      {lineData ? (
        <>
          <h2>Points Change Per Race Graph</h2>
          <LineChart
            style={{ width: '100%', aspectRatio: 1.618 }}
            responsive
            data={lineData}
          >
            <CartesianGrid />
            <Line dataKey={driverName} stroke='green' />
            <YAxis />
            <Legend />
          </LineChart>
        </>
      ) : (
        <div className="fetching-tag-container">
          <h3>Fetching data...</h3>
        </div>
      )}
    </div>
  );
};

const driverPointsChangeGraphInit = () => {
  const root = createRoot(document.getElementById('pointsChangeGraph'));
  root.render(<DriverPointsChangeGraph />);
};

// window.onload = init;
window.addEventListener('load', driverPointsChangeGraphInit);
