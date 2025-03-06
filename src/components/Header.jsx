import React from 'react';

export default function Header() {
  return (
    <>
      <header className="text-white py-6 shadow-md bg-emerald-700">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">MortgageMatters Calculator</h1>
          <p className="mt-2 text-emerald-100">
            Evaluate your options during your next fixed mortgage renewal period
          </p>
        </div>
      </header>

      <div className="bg-emerald-900 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <p className="text-sm text-emerald-50">
            Unlike traditional calculators that show vague lifetime projections,
            focus on what matters - your current renewal period. Make decisions
            with confidence based on <br />
            real commitments, not hypothetical 30-year scenarios.
          </p>
        </div>
      </div>
    </>
  );
}
