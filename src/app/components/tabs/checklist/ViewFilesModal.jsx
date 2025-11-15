"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useLoader } from "@/app/context/LoaderContext";
import sortObjectsByDateOrId from "@/app/functions/sortObjectsByDateOrId";
import DocumentEditModal from "./DocumentEditModal";

/**
 * ViewFilesModal - Display all versions of a checklist item
 *
 * Shows a table with all uploaded files for a specific checklist item,
 * with edit and delete actions.
 *
 * @param {boolean} open - Modal open state
 * @param {Function} onClose - Close modal callback
 * @param {Object} item - Item configuration
 * @param {Array} itemData - Array of file records
 * @param {boolean} readOnly - Read-only mode (no edit/delete actions)
 * @param {boolean} canEdit - User can edit files
 * @param {boolean} canDelete - User can delete files
 * @param {Function} loadData - Reload entity data
 * @param {string} apiRoute - API endpoint
 */
function ViewFilesModal({
  open,
  onClose,
  item,
  itemData,
  readOnly = false,
  canEdit,
  canDelete,
  loadData,
  entityType,
  entityId,
}) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState(null);

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  // Sort files by date or ID (newest first)
  const sortedFiles = Array.isArray(itemData)
    ? sortObjectsByDateOrId(itemData)
    : [];

  // Handle delete confirmation
  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setDeleteConfirmOpen(true);
  };

  // Execute delete
  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      startLoading();

      // Build generic DELETE endpoint: /api/v1/{entityType}/{entityId}/documents/{documentId}
      const deleteUrl = `/api/v1/${entityType}/${entityId}/documents/${fileToDelete.id}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteConfirmOpen(false);
        setFileToDelete(null);
        loadData();

        // Close modal if no more files
        const remaining = sortedFiles.filter(f => f.id !== fileToDelete.id);
        if (remaining.length === 0) {
          onClose();
        }
      } else {
        stopLoading();
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      stopLoading();
    }
  };

  // Get display value for file name
  const getDisplayValue = (file) => {
    // Prisma structure: Check metadata fields first
    if (file.metadata) {
      if (file.metadata.number) return file.metadata.number;
      if (file.metadata.comment) return file.metadata.comment;
      if (file.metadata.company) return file.metadata.company;
      if (file.metadata.dl_number) return file.metadata.dl_number;
    }

    // Prisma structure: fileName is always present
    return file.fileName || "No file";
  };

  // Format metadata for display
  const formatMetadata = (file) => {
    if (!file.metadata || Object.keys(file.metadata).length === 0) {
      return <span className="text-muted-foreground text-sm">No metadata</span>;
    }

    return (
      <div className="space-y-1">
        {Object.entries(file.metadata).map(([key, value]) => {
          if (!value) return null;

          // Format field name (camelCase to Title Case)
          const fieldName = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();

          return (
            <div key={key} className="text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">{fieldName}:</span>{' '}
              <span className="text-slate-600 dark:text-slate-400">{value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{item.label} - All Versions</DialogTitle>
            <DialogDescription>
              View all uploaded files for this item
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-auto">
            {sortedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No files uploaded
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metadata</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{formatMetadata(file)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <ButtonGroup>
                            {file.filePath && (
                              <Button
                                variant="outline"
                                size="icon"
                                asChild
                                className="h-8 w-8"
                              >
                                <Link
                                  href={`/api/v1/files/${file.filePath.replace(/^uploads\//, '')}`}
                                  target="_blank"
                                >
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="text-slate-600"
                                  />
                                </Link>
                              </Button>
                            )}
                            {!readOnly && canEdit && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setFileToEdit(file);
                                  setEditModalOpen(true);
                                }}
                                className="h-8 w-8"
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  className="text-orange-600"
                                />
                              </Button>
                            )}
                            {!readOnly && canDelete && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteClick(file)}
                                className="h-8 w-8"
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="text-red-600"
                                />
                              </Button>
                            )}
                          </ButtonGroup>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Document Edit Modal */}
      {fileToEdit && (
        <DocumentEditModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setFileToEdit(null);
          }}
          file={fileToEdit}
          entityType={entityType}
          entityId={entityId}
          loadData={loadData}
        />
      )}
    </>
  );
}

export default ViewFilesModal;
