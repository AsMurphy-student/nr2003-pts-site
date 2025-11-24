const React = require('react');
const { useEffect } = React;
const { createRoot } = require('react-dom/client');

const Table = () => {
  return (
    <div>
      <div>
        <p>testing</p>
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('testdiv'));
  root.render(<Table />);
}

window.onload = init;
