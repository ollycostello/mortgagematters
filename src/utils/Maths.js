export function getMortgagePayments(
  interestRate,
  mortgageAmount,
  mortgageYears,
  termLength
) {
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
  //   const schedule = [];
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

    // schedule.push({
    //   year,
    //   principalPayment: yearlyPrincipal,
    //   interestPayment: yearlyInterest,
    //   remainingBalance,
    // });

    if (remainingBalance === 0) break;
  }

  return monthlyPaymentValue;

  // Update state with calculated values
}
