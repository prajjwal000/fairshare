# Bugs found

---

## Bug 1

**How to reproduce:** Open the app. The expense list says "Newest first". The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top.

**What I changed:** In `src/components/ExpenseList.jsx:62`, reversed the sort comparison from `dateValue(a.date) - dateValue(b.date)` to `dateValue(b.date) - dateValue(a.date)` to sort descending by date.

---

## Bug 2

**How to reproduce:** Open the app. In the Filter section, select a member from the "Paid by" dropdown. The expense list does not filter — it still shows all expenses.

**What is wrong:** The select element returns string values, but `e.paidBy` is a number. The comparison `e.paidBy !== paidBy` always returns true because `"1" !== 1`.

**What I changed:** In `src/components/Filters.jsx:30`, converted the select value to a number: `onPaidBy(e.target.value === "" ? "" : Number(e.target.value))`.

---

## Bug 3

**How to reproduce:** Load the app with data from localStorage (after first visit). The dates appear as strings and sorting may be inconsistent.

**What is wrong:** The `dateValue()` function in `src/lib/format.js` returned the raw date value without converting to a numeric timestamp. When dates are loaded from localStorage as strings, this caused string-based comparison instead of chronological sorting.

**What I changed:** Updated `dateValue()` to properly convert Date objects and date strings to numeric timestamps using `.getTime()`.

---

## Bug 4

**How to reproduce:** Sort expenses by date (newest first). Delete the first expense in the list. The wrong expense gets deleted — it deletes the first expense in the original unsorted array, not the one you clicked.

**What is wrong:** The expense list is sorted for display, but the index passed to `onDeleteAt`/`onUpdateAt` is from the sorted array. The reducer uses this index on the unsorted `state.expenses` array, so it operates on the wrong expense.

**What I changed:** In `src/components/ExpenseList.jsx`, added a `findOriginalIndex()` function that maps the sorted index back to the original index in the `expenses` array by matching the expense's `id`, `description`, and `date`.

---

## Bug 5

**How to reproduce:** Add an expense of $100 split equally among 3 people. Check the balance — each person's share is $33.33, totaling $99.99 instead of $100.00. The group "loses" a penny.

**What is wrong:** `splitEqual()` in `src/lib/money.js` rounds each share independently with `.toFixed(2)`. When dividing $100 by 3, each gets $33.33, but 3 × $33.33 = $99.99. The last person should get the remainder to ensure shares sum to the original amount. Same issue exists in `splitByPercent()`.

**What I changed:** Updated both `splitEqual()` and `splitByPercent()` to calculate shares for all but the last person, then assign the remainder (`amount - sumOfPreviousShares`) to the last person. This guarantees the shares always sum to exactly the original amount.

---

## Bug 6

**How to reproduce:** Open the app. Look at the Balances panel. A person with a positive balance (they are owed money) shows "owes $X". A person with a negative balance (they owe money) shows "is owed $X".

**What is wrong:** The balance labels in `BalancesPanel.jsx` are swapped. A positive balance means the person paid more than their share and is owed money, but the code displays "owes". A negative balance means the person owes money, but the code displays "is owed".

**What I changed:** In `src/components/BalancesPanel.jsx`, swapped the labels: `bal > 0.005` now shows "is owed" (cls="owed"), and `bal < -0.005` now shows "owes" (cls="owe").

---
