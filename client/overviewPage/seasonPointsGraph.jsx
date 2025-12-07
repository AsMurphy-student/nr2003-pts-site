const React = require('react');
const { useEffect, useState } = React;
const { createRoot } = require('react-dom/client');
import { CartesianGrid, Legend, Line, LineChart, YAxis } from 'recharts';

// This component is on the overview page which 
// shows the top selected drivers points per race
const SeasonPointsGraph = () => {
  // Get champ data
  const [champData, setChampData] = useState();
  // Use states for lineData and lines components array
  const [lineData, setLineData] = useState();
  const [lines, setLines] = useState([]);

  // States for both the array of options in the dropdown
  // and the selected driver count
  const [countArray, setCountArray] = useState([]);
  const [driverCount, setDriverCount] = useState(5);

  // Function which gets lines for graph
  const getLines = (count) => {
    let tempLineData = [];
    for (let r = 0; r < champData.races.length; r++) {
      const newPointsObj = {};
      for (let d = 0; d < count; d++) {
        newPointsObj[`${champData.drivers[d].driverName}`] =
          champData.drivers[d].pointsPerRace[r];
      }
      tempLineData.push(newPointsObj);
    }
    setLineData(tempLineData);
  };

  // Get champData data on startup
  useEffect(async () => {
    const getChampionshipData = async () => {
      const response = await fetch('/getChampionship', {
        method: 'GET',
      });

      const result = await response.json();
      setChampData(result.championshipData);
    };
    await getChampionshipData();
  }, []);

  // When driver count or champdata changes
  // get lines again
  useEffect(() => {
    if (champData) {
      getLines(driverCount);
    }
  }, [champData, driverCount]);

  // When lineData changes
  // get lines and get count options array
  useEffect(() => {
    if (lineData) {
      const tempLines = [];
      for (let d = 0; d < driverCount; d++) {
        tempLines.push(
          <Line
            dataKey={champData.drivers[d].driverName}
            stroke={randomStrokeColor()}
          />,
        );
      }
      setLines(tempLines);
      const tempCount = [];
      for (let c = 5; c < champData.drivers.length; c = c + 5) {
        if (champData.drivers.length - c > 5) {
          tempCount.push(<option value={c}>{c}</option>);
          continue;
        } else {
          if (c !== champData.drivers.length) {
            tempCount.push(<option value={c}>{c}</option>);
          }
          tempCount.push(
            <option value={champData.drivers.length}>
              {champData.drivers.length}
            </option>,
          );
        }
      }
      setCountArray(tempCount);
    }
  }, [lineData]);

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

  return (
    <div id='seasonPointsGraph'>
      {lineData && champData && lines && countArray ? (
        <>
          <h2>Season Graph across {champData.races.length} Races</h2>
          <label id='driverCountSelectorLabel' for="drivers">Driver Count:</label>
          <select
            name="drivers"
            id="driverCountSelector"
            onChange={(e) => {
              setDriverCount(e.target.value);
              getLines(e.target.value);
            }}
          >
            {countArray}
          </select>
          <LineChart
            style={{ width: '100%', aspectRatio: 1.618 }}
            responsive
            data={lineData}
          >
            <CartesianGrid />
            {lines}
            <YAxis
              type="number"
              // We set the domain from 0 to the most points currently
              domain={[
                0,
                champData.drivers[0].pointsPerRace[
                  champData.drivers[0].pointsPerRace.length - 1
                ],
              ]}
              // This makes it so there is always 10 ticks on the y axis
              ticks={new Array(10).fill(0).map((_, index, arr) => {
                return Math.floor(
                  (champData.drivers[0].pointsPerRace[
                    champData.drivers[0].pointsPerRace.length - 1
                  ] /
                    arr.length) *
                    (index + 1),
                );
              })}
            />
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

const seasonPointsGraphInit = () => {
  const root = createRoot(document.getElementById('seasonGraph'));
  root.render(<SeasonPointsGraph />);
};

// window.onload = init;
window.addEventListener('load', seasonPointsGraphInit);
