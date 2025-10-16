/**
 * Adjustments Table Component
 *
 * Displays hours adjustments for the current pay period with:
 * - Hours, Comment, User columns
 * - Delete button for each adjustment (visible on hover)
 * - Add button to create new adjustments
 */

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function AdjustmentsTable({
  adjustments,
  onDelete,
  onAdd,
  canEdit,
}) {
  if (!adjustments || adjustments.length === 0) {
    return null; // Don't render if no adjustments
  }

  return (
    <div className="space-y-2">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Adjustments</h3>
        {canEdit && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Adjustments table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Hours</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="w-[150px]">User</TableHead>
              {canEdit && <TableHead className="w-[60px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.map((adj) => (
              <TableRow key={adj.id} className="group/adj">
                <TableCell>{adj.hours}</TableCell>
                <TableCell>{adj.comment}</TableCell>
                <TableCell>{adj.username}</TableCell>
                {canEdit && (
                  <TableCell>
                    {/* Delete button - visible on hover */}
                    <div className="opacity-0 group-hover/adj:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onDelete(adj.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
