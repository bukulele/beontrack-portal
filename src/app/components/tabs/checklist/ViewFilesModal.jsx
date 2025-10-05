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
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLoader } from "@/app/context/LoaderContext";
import extractFileNameFromURL from "@/app/functions/extractFileNameFromURL";
import sortObjectsByDateOrId from "@/app/functions/sortObjectsByDateOrId";
import defineDateBlock from "@/app/functions/defineDateBlock";
import checkNumericInput from "@/app/functions/checkNumericInput";

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
  canEdit,
  canDelete,
  loadData,
  apiRoute,
}) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

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

      const response = await fetch(apiRoute, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpointIdentifier: item.key,
          id: fileToDelete.id,
          changed_by: session.user.name,
          username: session.user.name,
        }),
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
    if (file.dl_number) return file.dl_number;
    if (file.number && item.key === "sin") return checkNumericInput(file.number);
    if (file.number && item.key !== "sin") return file.number;
    if (file.comment) return file.comment;
    if (file.company) return file.company;
    if (file.file) return extractFileNameFromURL(file.file);
    return "No file";
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
                    <TableHead>File/Document</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        {file.file ? (
                          <Link
                            href={file.file}
                            target="_blank"
                            className="font-semibold capitalize text-blue-600 hover:underline"
                          >
                            {getDisplayValue(file)}
                          </Link>
                        ) : (
                          <span className="font-semibold capitalize">
                            {getDisplayValue(file)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{defineDateBlock(file)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // TODO: Open edit modal
                                console.log("Edit file:", file);
                              }}
                              className="h-8 w-8"
                            >
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="text-orange-600"
                              />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
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
    </>
  );
}

export default ViewFilesModal;
