// const React = require('react');
// const { useEffect } = React;
const { createRoot } = require('react-dom/client');

const Table = () => {
  return (
    <>
      <h1>Hello world</h1>
    </>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('overviewTable'));
  root.render(<Table />);
}

window.onload = init;
