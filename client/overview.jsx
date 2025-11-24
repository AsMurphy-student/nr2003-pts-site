const React = require('react');
const { useEffect } = React;
const { createRoot } = require('react-dom/client');

const Table = () => {
  return (
    <div>
      <div>
        <p>stuff</p>
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
