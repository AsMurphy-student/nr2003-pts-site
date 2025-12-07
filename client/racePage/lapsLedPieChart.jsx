const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');
import { Legend, Pie, PieChart } from 'recharts';

// Component which is a pie chart of laps led in a race
const LapsLedPieChart = () => {
  // Get race data
  const [raceData, setRaceData] = useState();
  // Pie Data use state
  const [pieData, setPieData] = useState();

  // Get race data on load
  useEffect(async () => {
    const getRaceData = async () => {
      const response = await fetch('/getRace', {
        method: 'GET',
      });

      const result = await response.json();
      setRaceData(result.race);
    };
    await getRaceData();
  }, []);

  // Gets a random stroke color hex value
  // so that no matter how many lines there are
  // they should be different colors
  const randomStrokeColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      // Chooses random letter from list
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // If race data changes then calculate the line data
  useEffect(() => {
    if (raceData) {
      const tempLineData = [];
      raceData.finishPositions.forEach((driver) => {
        if (driver.lapsLed > 0) {
          const newObj = {
            name: driver.driverName,
            lapsLed: driver.lapsLed,
            fill: randomStrokeColor(),
          };
          tempLineData.push(newObj);
        }
      });
      // for (let d = 0; d < raceData.length; d++) {
      //   if (raceData[0])
      // }
      setPieData(tempLineData);
    }
  }, [raceData]);

  return (
    <div id="lapsLedChart">
      {pieData && raceData ? (
        <>
          <h2>Laps Led Pie Chart</h2>
          <PieChart
            style={{
              width: '100%',
              maxHeight: '40vh',
              aspectRatio: 1,
            }}
            responsive
          >
            <Pie
              data={pieData}
              innerRadius="80%"
              outerRadius="100%"
              cornerRadius="50%"
              fill="#8884d8"
              paddingAngle={5}
              dataKey="lapsLed"
            />
            <Legend />
          </PieChart>
        </>
      ) : (
        <div className="fetching-tag-container">
          <h3>Fetching data...</h3>
        </div>
      )}
    </div>
  );
};

const lapsLedPieChartInit = () => {
  const root = createRoot(document.getElementById('lapsLedPieChart'));
  root.render(<LapsLedPieChart />);
};

// window.onload = init;
window.addEventListener('load', lapsLedPieChartInit);
