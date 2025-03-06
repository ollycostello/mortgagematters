import React, { useState } from 'react';

import Header from 'components/Header.jsx';
import RenewalDetails from 'components/RenewalDetails.jsx';
import ResultsPanel from 'components/ResultsPanel.jsx';
import ComparisonTable from 'components/ComparisonTable.jsx';
import Footer from 'components/Footer.jsx';

import { getMortgagePayments } from 'utils/Maths';

export default function MortgageCalculator() {
  // State for details
  const [currency, setCurrency] = useState('$');
  const [mortgageYears, setMortgageYears] = useState(25);
  const [mortgageAmount, setMortgageAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [termLength, setTermLength] = useState(5);
  const [oneOffCost, setOneOffCost] = useState(0);

  const [calculating, setIsCalculating] = useState(false);

  // State for results
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showResultsPanel, setShowResultsPanel] = useState(false);

  // Add these comparisons
  const [comparisons, setComparisons] = useState([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const calculateMortgage = () => {
    // Simulate calculation delay
    setTimeout(() => {
      const monthlyPaymentValue = getMortgagePayments(
        interestRate,
        mortgageAmount,
        mortgageYears,
        termLength
      );

      setMonthlyPayment(monthlyPaymentValue);
      setIsCalculating(false);
      setShowResults(true);
      setShowResultsPanel(true);
    }, 1000);
  };

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

  const resetResults = () => {
    setShowResults(false);
    setShowResultsPanel(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="container px-20 pt-8 mx-0 pb-14 flex-grow bg-cream-300">
        <div className="max-w-5xl mx-auto">
          <div
            className={`grid grid-cols-1 ${
              showResultsPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
            } gap-8`}
          >
            <RenewalDetails
              details={{
                currency,
                mortgageYears,
                mortgageAmount,
                interestRate,
                termLength,
                oneOffCost,
              }}
              showResultsPanel={showResultsPanel}
              calculating={calculating}
              onSetIsCalculating={setIsCalculating}
              onSetCurrency={setCurrency}
              onSetMortgageYears={setMortgageYears}
              onSetMortgageAmount={setMortgageAmount}
              onSetInterestRate={setInterestRate}
              onSetTermLength={setTermLength}
              onSetOneOffCost={setOneOffCost}
              onCalculate={calculateMortgage}
              onReset={resetResults}
            />

            <ResultsPanel
              currency={currency}
              monthlyPayment={monthlyPayment}
              termLength={termLength}
              showResults={showResults}
              showResultsPanel={showResultsPanel}
              onAddToComparison={addToComparison}
            />
          </div>
        </div>
      </main>

      {/* Comparison section */}
      {comparisons.length > 0 && (
        <ComparisonTable
          comparisons={comparisons}
          comparisonTableOpen={isComparisonOpen}
          onToggleComparisonTable={setIsComparisonOpen}
          onResetComparisons={resetComparisons}
          onRemoveComparisons={removeComparison}
        />
      )}
      <Footer />
    </div>
  );
}
