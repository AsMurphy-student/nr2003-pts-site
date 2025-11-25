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
      <div>
        {/* <p>stuff</p>*/}
        <button onClick={() => console.log(champData)}>TEst again</button>
      </div>
    </div>
  );
};

const tableInit = () => {
  const root = createRoot(document.getElementById('overviewTable'));
  root.render(<Table />);
}

// window.onload = init;
window.addEventListener('load', tableInit);
