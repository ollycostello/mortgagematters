import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const MortgageCalculator = () => {
  // State for form inputs
  const [mortgageYears, setMortgageYears] = useState(25);
  const [mortgageAmount, setMortgageAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [termLength, setTermLength] = useState(5);
  const [oneOffCost, setOneOffCost] = useState(0);
  const [showOptionalSettings, setShowOptionalSettings] = useState(false);

  // State for form validation
  const [errors, setErrors] = useState({});

  // State for results
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showResultsPanel, setShowResultsPanel] = useState(false);

  // State for currency
  const [currency, setCurrency] = useState('$');
  const [animatedCurrencyIcon, setAnimatedCurrencyIcon] = useState('$');
  const [userEditedCurrency, setUserEditedCurrency] = useState(false);

  // Add these comparisons
  const [comparisons, setComparisons] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Animation for currency symbol
  useEffect(() => {
    const symbols = ['$', '£', '€'];
    let index = 0;

    if (userEditedCurrency) {
      setAnimatedCurrencyIcon(currency);
      return;
    }

    const interval = setInterval(() => {
      index = (index + 1) % symbols.length;
      setAnimatedCurrencyIcon(symbols[index]);
    }, 1000);

    return () => clearInterval(interval);
  }, [userEditedCurrency]);

  // Add this function to add the current calculation to comparisons
  const addToComparison = () => {
    if (!monthlyPayment) return; // Don't add if no calculation

    const newComparison = {
      id: Date.now(), // Unique identifier
      mortgageYears,
      mortgageAmount,
      interestRate,
      termLength,
      oneOffCost,
      monthlyPayment,
      totalPayment: monthlyPayment * termLength * 12,
      currencySymbol: currency,
    };

    setComparisons([...comparisons, newComparison]);
    setIsComparisonOpen(true); // Auto-open when adding
  };

  // Function to remove a comparison
  const removeComparison = (id) => {
    setComparisons(comparisons.filter((item) => item.id !== id));
  };

  // Function to reset all comparisons
  const resetComparisons = () => {
    setComparisons([]);
    setIsComparisonOpen(false);
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

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!mortgageYears || mortgageYears <= 0 || mortgageYears > 40) {
      newErrors.mortgageYears = 'Please enter a value between 0.1 and 40 years';
    }

    if (!mortgageAmount || mortgageAmount <= 0) {
      newErrors.mortgageAmount = 'Please enter a positive amount';
    }

    if (!interestRate || interestRate <= 0) {
      newErrors.interestRate = 'Please enter a positive interest rate';
    }

    if (!termLength || termLength <= 0 || termLength > 30) {
      newErrors.termLength = 'Please enter a term between 1 and 30 years';
    }

    if (oneOffCost < 0) {
      newErrors.oneOffCost = 'Please enter a non-negative amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate mortgage payments
  const calculateMortgage = () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // Convert annual interest rate to monthly
      const monthlyRate = interestRate / 100 / 12;

      // Calculate total number of payments
      const totalPayments = mortgageYears * 12;

      // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
      // Where P = payment, L = loan amount, c = monthly interest rate, n = total number of payments
      const monthlyPaymentValue =
        (mortgageAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

      // Calculate total amount paid over the life of the loan
      const totalPaymentValue = monthlyPaymentValue * totalPayments;

      // Calculate total interest paid
      const interestPaymentValue = totalPaymentValue - mortgageAmount;

      // Generate amortization schedule for visualization
      const schedule = [];
      let remainingBalance = mortgageAmount;

      for (let year = 1; year <= Math.min(termLength, mortgageYears); year++) {
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;

        for (let month = 1; month <= 12; month++) {
          const interestForMonth = remainingBalance * monthlyRate;
          const principalForMonth = monthlyPaymentValue - interestForMonth;

          yearlyPrincipal += principalForMonth;
          yearlyInterest += interestForMonth;
          remainingBalance -= principalForMonth;

          if (remainingBalance < 0) remainingBalance = 0;
        }

        schedule.push({
          year,
          principalPayment: yearlyPrincipal,
          interestPayment: yearlyInterest,
          remainingBalance,
        });

        if (remainingBalance === 0) break;
      }

      // Update state with calculated values
      setMonthlyPayment(monthlyPaymentValue);
      setIsCalculating(false);
      setShowResults(true);
      setShowResultsPanel(true);
    }, 1000);
  };

  // Handle input changes with formatting
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setMortgageAmount(parseFloat(value) || 0);
  };

  const handleOneOffCostChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setOneOffCost(parseFloat(value) || 0);
  };

  // Reset the form
  const resetForm = () => {
    setMortgageYears(25);
    setMortgageAmount(250000);
    setInterestRate(4.5);
    setTermLength(5);
    setOneOffCost(0);
    setShowOptionalSettings(false);
    setErrors({});
    setShowResults(false);
    setShowResultsPanel(false);
  };

  // Print or save results
  const exportResults = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-emerald-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">MortgageMatters Calculator</h1>
          <p className="mt-2 text-emerald-100">
            Evaluate your options during your next fixed mortgage renewal period
          </p>
        </div>
      </header>

      <div className="bg-emerald-700 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <p className="text-sm text-emerald-100">
            Unlike traditional calculators that show vague lifetime projections,
            focus on what matters - your current renewal period. Make decisions
            with confidence based on <br />
            real commitments, not hypothetical 30-year scenarios.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 mx-10 mb-14 flex-grow">
        <div className="max-w-5xl mx-auto">
          <div
            className={`grid grid-cols-1 ${
              showResultsPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
            } gap-8`}
          >
            {/* Input Section */}
            <div
              className={`bg-white rounded-lg shadow-lg p-6 ${
                showResultsPanel
                  ? 'lg:col-span-2'
                  : 'lg:max-w-2xl lg:mx-auto lg:w-full'
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">
                Your Renewal Details
              </h2>

              <div className="space-y-4">
                <div className="mt-1 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <div className="relative inline-block">
                      <select
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                          console.log('changed curr');
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
                      value={mortgageYears === 0 ? '' : mortgageYears}
                      onChange={(e) =>
                        setMortgageYears(parseFloat(e.target.value) || 0)
                      }
                      min="0.1"
                      max="40"
                      step="1"
                      className={`block w-full pr-14 py-3 px-4 rounded-md border ${
                        errors.mortgageYears
                          ? 'border-red-300'
                          : 'border-gray-300'
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
                      value={mortgageAmount === 0 ? '' : mortgageAmount}
                      onChange={handleAmountChange}
                      className={`block w-full pl-10 py-3 px-4 rounded-md border ${
                        errors.mortgageAmount
                          ? 'border-red-300'
                          : 'border-gray-300'
                      } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  {errors.mortgageAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.mortgageAmount}
                    </p>
                  )}
                </div>

                <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
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
                              Enter the annual interest rate offered for the
                              renewal
                            </div>
                          </div>
                        </span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm w-2/3">
                        <input
                          type="number"
                          value={interestRate === 0 ? '' : interestRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            setInterestRate(
                              value === '' ? 0 : parseFloat(value)
                            );
                          }}
                          min="0.001"
                          step="0.001"
                          className={`block w-full pr-8 py-3 px-4 rounded-md border ${
                            errors.interestRate
                              ? 'border-red-300'
                              : 'border-gray-300'
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
                          value={termLength === 0 ? '' : termLength}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTermLength(
                              value === '' ? 0 : parseInt(value) || 0
                            );
                          }}
                          min="1"
                          max="30"
                          step="1"
                          className={`block w-full pr-14 py-3 px-4 rounded-md border ${
                            errors.termLength
                              ? 'border-red-300'
                              : 'border-gray-300'
                          } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">
                            years
                          </span>
                        </div>
                      </div>
                    </div>
                    {errors.termLength && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.termLength}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setShowOptionalSettings(!showOptionalSettings)
                    }
                    className="text-blue-600 font-medium flex items-center"
                  >
                    {showOptionalSettings ? '− Hide' : '+ Show'} Optional
                    Settings
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
                                Some renewals offer a reduced rate with upfront
                                fees
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
                            value={oneOffCost.toLocaleString()}
                            onChange={handleOneOffCostChange}
                            className={`block w-full pl-10 py-3 px-4 rounded-md border ${
                              errors.oneOffCost
                                ? 'border-red-300'
                                : 'border-gray-300'
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

            {/* Results Section with animation */}
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
                    <p className="text-sm mt-3">
                      Your results will appear here
                    </p>
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
                          addToComparison();
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
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
                      >
                        Save Results
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Comparison section */}
      {comparisons.length > 0 && (
        <div className="bg-gray-100 border-t border-gray-200">
          <div
            className="container mx-auto px-4 py-5 flex justify-between items-center cursor-pointer"
            onClick={() => {
              setIsComparisonOpen(!isComparisonOpen);
              setTimeout(() => {
                if (!isComparisonOpen) {
                  window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth',
                  });
                }
              }, 50);
            }}
          >
            <div className="flex items-center">
              <span className="text-emerald-700 font-medium flex items-center">
                Your Comparisons ({comparisons.length})
                <svg
                  className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    isComparisonOpen ? 'transform rotate-180' : ''
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

          {isComparisonOpen && (
            <div className="container mx-auto px-4 pb-6">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
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
      )}

      <footer className="bg-emerald-900 text-white py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-emerald-200 text-sm">
            This calculator provides estimates only. Actual mortgage payments
            may vary. Please consult with a financial advisor before making
            decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MortgageCalculator;
