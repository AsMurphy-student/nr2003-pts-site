const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');
import { CartesianGrid, Legend, Line, LineChart, YAxis } from 'recharts';

const DriverGraph = () => {
  // Get driver and champ data to temporarily use
  let driverData;
  let champData;
  // Use states for lineData and driver points array
  const [driversPointsArray, setDriversPointsArray] = useState();
  const [lineData, setLineData] = useState();
  // Get main data on startup
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

    const driverIndex = champData.drivers.findIndex(
      (driver) => driver.driverName === driverData.driverName,
    );

    if (driverIndex > 0 && driverIndex < champData.drivers.length - 1) {
      setDriversPointsArray([
        champData.drivers[driverIndex - 1],
        driverData,
        champData.drivers[driverIndex + 1],
      ]);
    } else if (driverIndex === 0) {
      setDriversPointsArray([
        driverData,
        champData.drivers[driverIndex + 1],
        champData.drivers[driverIndex + 2],
      ]);
    } else {
      setDriversPointsArray([
        champData.drivers[driverIndex - 2],
        champData.drivers[driverIndex - 1],
        driverData,
      ]);
    }
  }, []);

  // Once driverpoints data is updated
  // setup line data
  useEffect(() => {
    if (driversPointsArray) {
      let tempLineData = [];
      for (let i = 0; i < driversPointsArray[0].pointsPerRace.length; i++) {
        const newObj = {
          [`${driversPointsArray[0].driverName}`]:
            driversPointsArray[0].pointsPerRace[i],
          [`${driversPointsArray[1].driverName}`]:
            driversPointsArray[1].pointsPerRace[i],
          [`${driversPointsArray[2].driverName}`]:
            driversPointsArray[2].pointsPerRace[i],
        };
        tempLineData.push(newObj);
      }
      console.log(tempLineData);
      console.log(driversPointsArray);
      setLineData(tempLineData);
    }
  }, [driversPointsArray]);
  return (
    <div id='driverPointsGraph'>
      {driversPointsArray && lineData ? (
        <>
          <h2>Points Graph</h2>
          <LineChart
            style={{ width: '100%', aspectRatio: 1.618 }}
            responsive
            data={lineData}
          >
            <CartesianGrid />
            <Line dataKey={driversPointsArray[0].driverName} stroke='red' />
            <Line dataKey={driversPointsArray[1].driverName} stroke='green' />
            <Line dataKey={driversPointsArray[2].driverName} stroke='blue' />
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

const driverGraphInit = () => {
  const root = createRoot(document.getElementById('driverGraph'));
  root.render(<DriverGraph />);
};

// window.onload = init;
window.addEventListener('load', driverGraphInit);
