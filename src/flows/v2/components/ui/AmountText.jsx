import React from 'react';
import { formatIN } from '../../utils/formatIN';
import { useCountUp } from '../../hooks/useCountUp';

export default function AmountText({
  amount,
  animate = false,
  className = '',
  currency = '₹',
}) {
  const numericAmount = Number(amount) || 0;
  const animatedValue = useCountUp(animate ? numericAmount : 0, 500);
  const displayVal = animate ? animatedValue : numericAmount;

  return (
    <span className={`tabular-nums font-bold ${className}`}>
      {currency}
      {formatIN(displayVal)}
    </span>
  );
}
