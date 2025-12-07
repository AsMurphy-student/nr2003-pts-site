const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');
import { CartesianGrid, Legend, Line, LineChart, YAxis } from 'recharts';

// Graph of points change per race
const DriverPointsChangeGraph = () => {
  // Driver Data stored for temporary use
  let driverData;
  // Line data and driver name use states for graph
  const [lineData, setLineData] = useState();
  const [driverName, setDriverName] = useState('');
  // Get data and structure it on component load
  useEffect(async () => {
    const getDriverData = async () => {
      const response = await fetch('/getDriver', {
        method: 'GET',
      });

      const result = await response.json();
      driverData = result.driverObj;
    };
    await getDriverData();

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
    <div id='driverPointsChangeGraph'>
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
