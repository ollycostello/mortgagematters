import MortgageCalculator from './components/MortgageCalculator';

const favicon = document.getElementById('browsericon');
if (process.env.NODE_ENV === 'development') {
  favicon.href = `${process.env.PUBLIC_URL}/react.ico`;
} else {
  favicon.href = `${process.env.PUBLIC_URL}/mm-icon.ico`;
}

function App() {
  return (
    <div className="App">
      <MortgageCalculator />
    </div>
  );
}

export default App;
