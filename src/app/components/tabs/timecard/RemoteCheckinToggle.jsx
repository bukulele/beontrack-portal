/**
 * Remote Check-in Toggle Component
 *
 * Toggle switch to enable/disable mobile check-in for the user
 * Only editable by payroll managers
 */

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function RemoteCheckinToggle({ enabled, onToggle, canEdit }) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="remote-checkin" className="cursor-pointer">
        Allow mobile check-in
      </Label>
      <Switch
        id="remote-checkin"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={!canEdit}
      />
    </div>
  );
}
