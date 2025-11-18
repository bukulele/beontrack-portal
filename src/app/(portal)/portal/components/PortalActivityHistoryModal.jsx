"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useLoader } from "@/app/context/LoaderContext";
import { OPTION_LISTS } from "@/config/clientData";
import checkActivityPeriod from "@/app/functions/checkActivityPeriod";
import { parse, format, isValid } from "date-fns";

const ACTIVITY_TEMPLATE = {
  activityType: "",
  description: "",
  startDate: "",
  endDate: "",
  organizationName: "",
  roleOrPosition: "",
  location: "",
  emailAddress: "",
  tillNow: false,
};

/**
 * Portal Activity History Modal - Simplified version for portal users
 *
 * SIMPLIFIED FROM OFFICE VERSION:
 * - Uses dynamic entityType parameter (not hardcoded to "employees")
 * - No review functionality (no wasReviewed, reviewedBy)
 * - Portal users can only edit their own activity history
 *
 * ARCHITECTURE:
 * - Takes a snapshot of itemData when modal opens
 * - Works with the snapshot until save/cancel
 * - Ignores parent data changes while open (prevents infinite loops)
 * - Converts between camelCase (API) and snake_case (legacy UI) as needed
 *
 * @param {boolean} open - Modal open state
 * @param {Function} onClose - Close modal callback
 * @param {Object} item - Item configuration
 * @param {Array} itemData - Activity history data from parent
 * @param {Object} entityData - Entity data (not used, included for consistency)
 * @param {Function} loadData - Reload entity data callback
 * @param {string} entityType - Entity type (employees, drivers, etc.)
 * @param {string} entityId - Entity ID
 */
export function PortalActivityHistoryModal({
  open,
  onClose,
  item,
  itemData = [],
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  const [activities, setActivities] = useState([]);
  const [gaps, setGaps] = useState([]);
  const { startLoading, stopLoading } = useLoader();

  const period = 10; // years to check

  // Take snapshot of initial data when modal opens
  // This is the ONLY time we look at itemData - prevents infinite loops
  const initialActivities = useMemo(() => {
    if (!open) return [];

    if (!itemData || !Array.isArray(itemData)) return [];

    // Convert API data (camelCase) to internal format
    return itemData.map(item => {
      // Convert ISO date strings to yyyy-MM-dd format
      const formatDate = (dateValue) => {
        if (!dateValue) return "";
        const date = new Date(dateValue);
        if (!isValid(date)) return "";
        return format(date, "yyyy-MM-dd");
      };

      return {
        id: item.id,
        activityType: item.activityType || item.activity_type || "",
        description: item.description || "",
        startDate: formatDate(item.startDate || item.start_date),
        endDate: formatDate(item.endDate || item.end_date),
        organizationName: item.organizationName || item.organization_name || "",
        roleOrPosition: item.roleOrPosition || item.role_or_position || "",
        location: item.location || "",
        emailAddress: item.emailAddress || item.email_address || "",
        tillNow: item.tillNow || item.till_now || false,
      };
    });
  }, [open]); // Only recalculate when modal opens

  // Initialize activities from snapshot when modal opens
  useEffect(() => {
    if (open) {
      setActivities(initialActivities);
    }
  }, [open, initialActivities]);

  // Check for gaps whenever activities change
  useEffect(() => {
    if (activities.length > 0) {
      // Convert to format expected by checkActivityPeriod
      const activitiesForCheck = activities
        .filter(a => !a._deleted)
        .map(a => ({
          start_date: a.startDate,
          end_date: a.tillNow ? null : a.endDate,
          till_now: a.tillNow,
        }));

      const detectedGaps = checkActivityPeriod(activitiesForCheck, period);
      setGaps(detectedGaps);
    } else {
      setGaps([]);
    }
  }, [activities]);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(activities) !== JSON.stringify(initialActivities);
  }, [activities, initialActivities]);

  const addActivity = () => {
    setActivities([...activities, { ...ACTIVITY_TEMPLATE }]);
  };

  const updateActivity = (index, field, value) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const deleteActivity = (index) => {
    const activity = activities[index];
    if (activity.id) {
      // Mark for deletion (has ID = exists in DB)
      const updated = [...activities];
      updated[index] = { ...activity, _deleted: true };
      setActivities(updated);
    } else {
      // Remove from list (no ID = not saved yet)
      setActivities(activities.filter((_, i) => i !== index));
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setActivities([]);
    setGaps([]);
    onClose();
  };

  const saveActivities = async () => {
    try {
      startLoading();

      for (const activity of activities) {
        if (!activity) continue;

        // Prepare activity data for API (camelCase)
        const activityData = {
          activityType: activity.activityType,
          description: activity.description || null,
          startDate: activity.startDate,
          endDate: activity.tillNow ? null : activity.endDate,
          tillNow: activity.tillNow || false,
          organizationName: activity.organizationName || null,
          roleOrPosition: activity.roleOrPosition || null,
          location: activity.location || null,
          emailAddress: activity.emailAddress || null,
        };

        let response;

        if (activity.id && !activity._deleted) {
          // UPDATE existing activity
          response = await fetch(`/api/v1/${entityType}/${entityId}/activity-history/${activity.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(activityData),
          });
        } else if (!activity.id && !activity._deleted) {
          // CREATE new activity
          response = await fetch(`/api/v1/${entityType}/${entityId}/activity-history`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(activityData),
          });
        } else if (activity._deleted && activity.id) {
          // DELETE activity
          response = await fetch(`/api/v1/${entityType}/${entityId}/activity-history/${activity.id}`, {
            method: "DELETE",
          });
        }

        if (response && !response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save activity history");
        }
      }

      stopLoading();
      loadData(); // Reload parent data
      handleClose();
    } catch (error) {
      console.error("Error saving activity history:", error);
      alert(`Error: ${error.message}`);
      stopLoading();
    }
  };

  const visibleActivities = activities.filter(a => !a._deleted);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Activity History (last {period} years)</DialogTitle>
          <DialogDescription>
            Add and edit employment, education, and other activity periods.
          </DialogDescription>
        </DialogHeader>

        {/* Gap warning */}
        {gaps.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Activity history gaps found:</p>
              {gaps.map((gap, idx) => (
                <p key={idx}>
                  From {gap.start} to {gap.end}
                </p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Activity list */}
        <div className="space-y-4">
          {visibleActivities.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No activity history. Click &quot;Add Activity&quot; to get started.
            </p>
          ) : (
            visibleActivities.map((activity, index) => {
              const actualIndex = activities.findIndex(a => a === activity);
              return (
                <Card key={actualIndex}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Activity {index + 1}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteActivity(actualIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Activity Type *</Label>
                        <Select
                          value={activity.activityType}
                          onValueChange={(val) =>
                            updateActivity(actualIndex, "activityType", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent>
                            {OPTION_LISTS.ACTIVITY_CHOICES.map((choice) => (
                              <SelectItem key={choice.value} value={choice.value}>
                                {choice.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label>Organization Name</Label>
                        <Input
                          value={activity.organizationName || ""}
                          onChange={(e) =>
                            updateActivity(
                              actualIndex,
                              "organizationName",
                              e.target.value
                            )
                          }
                          placeholder="Company or school name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Start Date *</Label>
                        <DatePicker
                          value={activity.startDate ? parse(activity.startDate, "yyyy-MM-dd", new Date()) : undefined}
                          onChange={(date) =>
                            updateActivity(actualIndex, "startDate", date && isValid(date) ? format(date, "yyyy-MM-dd") : "")
                          }
                          startYear={1950}
                          endYear={new Date().getFullYear() + 10}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>End Date *</Label>
                        <div className="flex items-center gap-2">
                          <DatePicker
                            value={activity.endDate ? parse(activity.endDate, "yyyy-MM-dd", new Date()) : undefined}
                            onChange={(date) =>
                              updateActivity(actualIndex, "endDate", date && isValid(date) ? format(date, "yyyy-MM-dd") : "")
                            }
                            disabled={activity.tillNow}
                            startYear={1950}
                            endYear={new Date().getFullYear() + 10}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-1.5">
                            <Checkbox
                              checked={activity.tillNow}
                              onCheckedChange={(checked) =>
                                updateActivity(actualIndex, "tillNow", checked)
                              }
                            />
                            <Label className="text-xs cursor-pointer whitespace-nowrap" onClick={() =>
                              updateActivity(actualIndex, "tillNow", !activity.tillNow)
                            }>
                              Till now
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Role/Position</Label>
                        <Input
                          value={activity.roleOrPosition || ""}
                          onChange={(e) =>
                            updateActivity(
                              actualIndex,
                              "roleOrPosition",
                              e.target.value
                            )
                          }
                          placeholder="Job title or role"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Location</Label>
                        <Input
                          value={activity.location || ""}
                          onChange={(e) =>
                            updateActivity(actualIndex, "location", e.target.value)
                          }
                          placeholder="City, Province/State"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={activity.emailAddress || ""}
                        onChange={(e) =>
                          updateActivity(
                            actualIndex,
                            "emailAddress",
                            e.target.value
                          )
                        }
                        placeholder="Contact email (optional)"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={activity.description || ""}
                        onChange={(e) =>
                          updateActivity(actualIndex, "description", e.target.value)
                        }
                        placeholder="Additional details..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={addActivity}>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
          <div className="flex-1" />
          <ButtonGroup>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={saveActivities} disabled={!hasChanges}>
              Save Changes
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PortalActivityHistoryModal;
