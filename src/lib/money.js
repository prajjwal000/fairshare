export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

export function splitEqual(amount, ids) {
  const n = ids.length || 1;
  const shares = {};
  let remainder = amount;
  for (let i = 0; i < ids.length; i++) {
    if (i === ids.length - 1) {
      shares[ids[i]] = Number(remainder.toFixed(2));
    } else {
      const share = Number((amount / n).toFixed(2));
      shares[ids[i]] = share;
      remainder -= share;
    }
  }
  return shares;
}

export function percentsSumTo100(percents) {
  const values = Object.values(percents).map(Number);
  return values.reduce((a, b) => a + b, 0) === 100;
}

export function splitByPercent(amount, percents) {
  const entries = Object.entries(percents);
  const shares = {};
  let remainder = amount;
  for (let i = 0; i < entries.length; i++) {
    const [id, pct] = entries[i];
    if (i === entries.length - 1) {
      shares[id] = Number(remainder.toFixed(2));
    } else {
      const share = Number(((amount * Number(pct)) / 100).toFixed(2));
      shares[id] = share;
      remainder -= share;
    }
  }
  return shares;
}

export function sharesForExpense(expense) {
  if (expense.splitType === "percent" && expense.percents) {
    return splitByPercent(expense.amount, expense.percents);
  }
  return splitEqual(expense.amount, expense.splitWith);
}
