import React from 'react';

export default function ResultsPanel({
  currency,
  monthlyPayment,
  termLength,
  showResults,
  showResultsPanel,
  onAddToComparison,
}) {
  // Print or save results
  const exportResults = () => {
    window.print();
  };

  // Format currency
  const formatCurrency = (value) => {
    let currencyCode = 'USD';

    if (currency === '£') {
      currencyCode = 'GBP';
    } else if (currency === '€') {
      currencyCode = 'EUR';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div
      className={`transition-all duration-600 ease-in-out ${
        showResultsPanel
          ? 'opacity-100 max-h-screen'
          : 'opacity-0 max-h-0 overflow-hidden'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Results Summary</h2>

        {!showResults ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg mb-2">
              Enter your mortgage details
              <br /> and click Calculate
            </p>
            <p className="text-sm mt-3">Your results will appear here</p>
          </div>
        ) : (
          <div>
            <div className="bg-emerald-50 p-4 rounded-md">
              <p className="text-sm font-medium text-emerald-800 mb-1">
                Monthly Payments
              </p>
              <p className="text-3xl font-bold text-emerald-900">
                {formatCurrency(monthlyPayment)}
              </p>
            </div>

            <div className="bg-gray-50 my-4 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Total Payments (over {termLength} years)
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(monthlyPayment * termLength * 12)}
              </p>
            </div>

            <div className="flex flex-col space-y-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  onAddToComparison();
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: 'smooth',
                    });
                  }, 50);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 text-center"
              >
                Add to Comparison
              </button>

              <button
                type="button"
                onClick={exportResults}
                className="hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center bg-charcoal-500"
              >
                Save Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
