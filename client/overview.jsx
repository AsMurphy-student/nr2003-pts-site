const React = require('react');
const { useEffect } = React;
const { createRoot } = require('react-dom/client');

const test = async () => {
  const response = await fetch('/getChampionship', {
    method: 'GET',
  });

  console.log(response);
  // const result = await response.json();
}

const Table = () => {
  return (
    <div>
      <div>
        {/* <p>stuff</p>*/}
        <button onClick={test}>test</button>
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
