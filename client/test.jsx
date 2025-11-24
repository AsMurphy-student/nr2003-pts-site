const React = require('react');
const { useEffect } = React;
const { createRoot } = require('react-dom/client');

const Test = () => {
  return (
    <div>
      <div>
        <p>testing</p>
      </div>
    </div>
  );
};

const testInit = () => {
  const root = createRoot(document.getElementById('testdiv'));
  root.render(<Test />);
}

// window.onload = testInit;
window.addEventListener('load', testInit);
