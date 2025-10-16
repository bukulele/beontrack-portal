/**
 * Adjustment Dialog Component
 *
 * Dialog for adding hours adjustments to a pay period.
 * Includes fields for hours and optional comment.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdjustmentDialog({ open, onSave, onCancel }) {
  const [hours, setHours] = useState('');
  const [comment, setComment] = useState('');

  const handleSave = () => {
    // Validate hours
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hours.trim() === '') {
      alert('Please enter a valid number for hours');
      return;
    }

    onSave({ hours: hoursNum, comment: comment.trim() });

    // Reset form
    setHours('');
    setComment('');
  };

  const handleCancel = () => {
    // Reset form
    setHours('');
    setComment('');
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Adjustment</DialogTitle>
          <DialogDescription>
            Add hours adjustment for this pay period. Enter positive or negative hours.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Hours input */}
          <div className="space-y-2">
            <Label htmlFor="hours">Hours *</Label>
            <Input
              id="hours"
              type="number"
              step="0.25"
              placeholder="e.g., 8 or -2.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              autoFocus
            />
          </div>

          {/* Comment input */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Optional comment about this adjustment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
