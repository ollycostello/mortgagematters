import React from 'react';

export default function ComparisonTable({
  comparisons,
  comparisonTableOpen,
  toggleComparisonTable,
  resetComparisons,
  removeComparison,
}) {
  return (
    <div className="bg-cream-200 border-t border-gray-200">
      <div
        className="container mx-auto px-4 py-5 flex justify-between items-center cursor-pointer"
        onClick={() => {
          toggleComparisonTable(!comparisonTableOpen);
          setTimeout(() => {
            if (!comparisonTableOpen) {
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
              });
            }
          }, 50);
        }}
      >
        <div className="flex items-center">
          <span className="text-charcoal-600 font-medium flex items-center">
            Your Comparisons ({comparisons.length})
            <svg
              className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                comparisonTableOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetComparisons();
          }}
          className="text-red-600 text-sm hover:text-red-800"
        >
          Reset All
        </button>
      </div>

      {comparisonTableOpen && (
        <div className="container mx-auto px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-lg shadow-md">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-cream-300 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terms
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm">
                        {item.currencySymbol}
                        {item.mortgageAmount.toLocaleString()} over{' '}
                        {item.termLength} years
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.interestRate}%
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-emerald-800">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency:
                            item.currencySymbol === '£'
                              ? 'GBP'
                              : item.currencySymbol === '€'
                              ? 'EUR'
                              : 'USD',
                        }).format(item.monthlyPayment)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency:
                            item.currencySymbol === '£'
                              ? 'GBP'
                              : item.currencySymbol === '€'
                              ? 'EUR'
                              : 'USD',
                        }).format(item.totalPayment)}
                        <span className="text-xs text-gray-500 ml-1">
                          ({item.termLength} years)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button
                          onClick={() => removeComparison(item.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          aria-label="Remove comparison"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
