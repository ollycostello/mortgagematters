import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function RenewalDetails({
  details,
  showResultsPanel,
  isCalculating,
  onSetIsCalculating,
  onSetCurrency,
  onSetMortgageYears,
  onSetMortgageAmount,
  onSetInterestRate,
  onSetTermLength,
  onSetOneOffCost,
  onCalculate,
  onReset,
}) {
  const [showOptionalSettings, setShowOptionalSettings] = useState(false);
  const [errors, setErrors] = useState({});

  const [animatedCurrencyIcon, setAnimatedCurrencyIcon] = useState('$');
  const [userEditedCurrency, setUserEditedCurrency] = useState(false);

  useEffect(() => {
    if (userEditedCurrency) {
      setAnimatedCurrencyIcon(details.currency);
      return;
    }

    const symbols = ['$', '£', '€'];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % symbols.length;
      setAnimatedCurrencyIcon(symbols[index]);
    }, 1000);

    return () => clearInterval(interval);
  }, [details, userEditedCurrency]);

  const resetForm = () => {
    onSetMortgageYears(25);
    onSetMortgageAmount(250000);
    onSetInterestRate(4.5);
    onSetTermLength(5);
    onSetOneOffCost(0);
    setShowOptionalSettings(false);
    setErrors({});

    onReset();
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      !details.mortgageYears ||
      details.mortgageYears <= 0 ||
      details.mortgageYears > 40
    ) {
      newErrors.mortgageYears = 'Please enter a value between 0.1 and 40 years';
    }

    if (!details.mortgageAmount || details.mortgageAmount <= 0) {
      newErrors.mortgageAmount = 'Please enter a positive amount';
    }

    if (!details.interestRate || details.interestRate <= 0) {
      newErrors.interestRate = 'Please enter a positive interest rate';
    }

    if (
      !details.termLength ||
      details.termLength <= 0 ||
      details.termLength > 30
    ) {
      newErrors.termLength = 'Please enter a term between 1 and 30 years';
    }

    if (details.oneOffCost < 0) {
      newErrors.oneOffCost = 'Please enter a non-negative amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with formatting
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    onSetMortgageAmount(parseFloat(value) || 0);
  };

  const handleOneOffCostChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    onSetOneOffCost(parseFloat(value) || 0);
  };

  const calculateMortgage = () => {
    if (!validateForm()) return;

    onSetIsCalculating(true);

    onCalculate();
  };

  return (
    <>
      {/* Input Section */}
      <div
        className={`bg-white rounded-lg shadow-lg p-6 ${
          showResultsPanel
            ? 'lg:col-span-2'
            : 'lg:max-w-2xl lg:mx-auto lg:w-full'
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Your Renewal Details</h2>

        <div className="space-y-4">
          <div className="mt-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <div className="relative">
              <div className="relative inline-block">
                <select
                  value={details.currency}
                  onChange={(e) => {
                    onSetCurrency(e.target.value);
                    setUserEditedCurrency(true);
                  }}
                  className="w-32 py-3 px-4 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="$">$ USD</option>
                  <option value="£">£ GBP</option>
                  <option value="€">€ EUR</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mortgage Years Remaining
              <span className="ml-1 inline-block relative">
                <div className="relative group">
                  <Info size={16} className="text-gray-500" />
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-50">
                    Enter the number of years left on your mortgage
                  </div>
                </div>
              </span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                value={details.mortgageYears === 0 ? '' : details.mortgageYears}
                onChange={(e) =>
                  onSetMortgageYears(parseFloat(e.target.value) || 0)
                }
                min="0.1"
                max="40"
                step="1"
                className={`block w-full pr-14 py-3 px-4 rounded-md border ${
                  errors.mortgageYears ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">years</span>
              </div>
            </div>
            {errors.mortgageYears && (
              <p className="mt-1 text-sm text-red-600">
                {errors.mortgageYears}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mortgage Amount Remaining
              <span className="ml-1 inline-block relative">
                <div className="relative group">
                  <Info size={16} className="text-gray-500" />
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-50">
                    Enter the current outstanding balance of your mortgage
                  </div>
                </div>
              </span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {animatedCurrencyIcon}
                </span>
              </div>
              <input
                type="text"
                value={
                  details.mortgageAmount === 0 ? '' : details.mortgageAmount
                }
                onChange={handleAmountChange}
                className={`block w-full pl-10 py-3 px-4 rounded-md border ${
                  errors.mortgageAmount ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            {errors.mortgageAmount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.mortgageAmount}
              </p>
            )}
          </div>

          <div className="p-4 rounded-md border border-emerald-100 bg-cream-300">
            <h3 className="text-lg font-medium text-emerald-800 mb-3">
              Proposed Renewal Terms
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <label className="block text-sm font-medium text-gray-700 mb-1 pt-5 w-1/3">
                  Interest Rate
                  <span className="ml-1 inline-block relative">
                    <div className="relative group">
                      <Info size={16} className="text-gray-500" />
                      <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-50">
                        Enter the annual interest rate offered for the renewal
                      </div>
                    </div>
                  </span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm w-2/3">
                  <input
                    type="number"
                    value={
                      details.interestRate === 0 ? '' : details.interestRate
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      onSetInterestRate(value === '' ? 0 : parseFloat(value));
                    }}
                    min="0.001"
                    step="0.01"
                    className={`block w-full pr-8 py-3 px-4 rounded-md border ${
                      errors.interestRate ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
              {errors.interestRate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.interestRate}
                </p>
              )}

              <div className="flex justify-between items-start">
                <label className="block text-sm font-medium text-gray-700 mb-1 pt-5 w-1/3">
                  Term Length
                  <span className="ml-1 inline-block relative">
                    <div className="relative group">
                      <Info size={16} className="text-gray-500" />
                      <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-50">
                        Enter the number of years for the renewal term
                      </div>
                    </div>
                  </span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm w-2/3">
                  <input
                    type="number"
                    value={details.termLength === 0 ? '' : details.termLength}
                    onChange={(e) => {
                      const value = e.target.value;
                      onSetTermLength(value === '' ? 0 : parseInt(value) || 0);
                    }}
                    min="1"
                    max="30"
                    step="1"
                    className={`block w-full pr-14 py-3 px-4 rounded-md border ${
                      errors.termLength ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">years</span>
                  </div>
                </div>
              </div>
              {errors.termLength && (
                <p className="mt-1 text-sm text-red-600">{errors.termLength}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowOptionalSettings(!showOptionalSettings)}
              className="font-medium flex items-center text-charcoal-600"
            >
              {showOptionalSettings ? '− Hide' : '+ Show'} Optional Settings
            </button>

            {showOptionalSettings && (
              <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upfront Fees
                    <span className="ml-1 inline-block relative">
                      <div className="relative group">
                        <Info size={16} className="text-gray-500" />
                        <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 p-2 bg-gray-800 text-xs text-white rounded shadow-lg z-50">
                          Some renewals offer a reduced rate with upfront fees
                        </div>
                      </div>
                    </span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {animatedCurrencyIcon}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={details.oneOffCost.toLocaleString()}
                      onChange={handleOneOffCostChange}
                      className={`block w-full pl-10 py-3 px-4 rounded-md border ${
                        errors.oneOffCost ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {errors.oneOffCost && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.oneOffCost}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              type="button"
              onClick={calculateMortgage}
              disabled={isCalculating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-md shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                'Calculate'
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-md shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
