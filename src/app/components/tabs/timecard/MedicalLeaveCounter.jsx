/**
 * Medical Leave Counter Component
 *
 * Displays remaining medical leave days for the year
 */

export default function MedicalLeaveCounter({ daysLeft, totalDays, year }) {
  return (
    <div className="text-sm text-right text-muted-foreground">
      Medical leave days left in {year}:{' '}
      <span className="font-semibold text-foreground">{daysLeft}</span> from{' '}
      {totalDays}
    </div>
  );
}
