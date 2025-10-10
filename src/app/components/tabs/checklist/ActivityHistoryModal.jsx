"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useLoader } from "@/app/context/LoaderContext";
import { OPTION_LISTS } from "@/config/clientData";
import checkActivityPeriod from "@/app/functions/checkActivityPeriod";

/**
 * ActivityHistoryModal - Modal for editing activity history
 *
 * Allows adding, editing, and deleting activity history periods.
 * Shows validation warnings for gaps in history.
 *
 * @param {boolean} open - Modal open state
 * @param {Function} onClose - Close modal callback
 * @param {Object} item - Item configuration
 * @param {Array} itemData - Activity history data
 * @param {Object} entityData - Entity data
 * @param {Function} loadData - Reload entity data
 * @param {string} entityType - Entity type (driver/employee)
 * @param {number} entityId - Entity ID
 */
export function ActivityHistoryModal({
  open,
  onClose,
  item,
  itemData = [],
  entityData,
  loadData,
  entityType,
  entityId,
}) {
  const ACTIVITY_TEMPLATE = {
    activity_type: "",
    description: "",
    start_date: "",
    end_date: "",
    organization_name: "",
    role_or_position: "",
    location: "",
    email_address: "",
    till_now: false,
  };

  const [activities, setActivities] = useState([]);
  const [gaps, setGaps] = useState([]);
  const { startLoading, stopLoading } = useLoader();

  const period = 10; // years to check

  // Initialize activities from itemData
  useEffect(() => {
    if (itemData && Array.isArray(itemData)) {
      setActivities(itemData.map(item => ({ ...item })));
    } else {
      setActivities([]);
    }
  }, [itemData, open]);

  // Check for gaps whenever activities change
  useEffect(() => {
    if (activities.length > 0) {
      const detectedGaps = checkActivityPeriod(activities, period);
      setGaps(detectedGaps);
    } else {
      setGaps([]);
    }
  }, [activities]);

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
      // Mark for deletion
      const updated = [...activities];
      updated[index] = { ...activity, delete: true };
      setActivities(updated);
    } else {
      // Remove from list if not saved yet
      setActivities(activities.filter((_, i) => i !== index));
    }
  };

  const saveActivities = async () => {
    try {
      startLoading();

      for (const activity of activities) {
        if (!activity) continue;

        const data = new FormData();
        data.append(entityType, entityId);
        data.append("endpointIdentifier", entityType);

        // Append each field
        for (const [key, value] of Object.entries(activity)) {
          if (key === "end_date" && activity.till_now) {
            data.append(key, "");
          } else {
            data.append(key, value);
          }
        }

        let method;
        if (activity.id && !activity.delete) {
          method = "PATCH";
        } else if (!activity.id && !activity.delete) {
          method = "POST";
        } else if (activity.delete) {
          method = "DELETE";
        }

        const response = await fetch("/api/activity-history", {
          method,
          body: data,
        });

        if (!response.ok) {
          throw new Error("Failed to save activity history");
        }
      }

      stopLoading();
      loadData();
      onClose();
    } catch (error) {
      console.error("Error saving activity history:", error);
      stopLoading();
    }
  };

  const visibleActivities = activities.filter(a => !a.delete);

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
              No activity history. Click "Add Activity" to get started.
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
                          value={activity.activity_type}
                          onValueChange={(val) =>
                            updateActivity(actualIndex, "activity_type", val)
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
                          value={activity.organization_name || ""}
                          onChange={(e) =>
                            updateActivity(
                              actualIndex,
                              "organization_name",
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
                        <Input
                          type="date"
                          value={activity.start_date || ""}
                          onChange={(e) =>
                            updateActivity(actualIndex, "start_date", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>End Date *</Label>
                        <InputGroup>
                          <InputGroupInput
                            type="date"
                            value={activity.end_date || ""}
                            onChange={(e) =>
                              updateActivity(actualIndex, "end_date", e.target.value)
                            }
                            disabled={activity.till_now}
                          />
                          <InputGroupAddon align="inline-end">
                            <div className="flex items-center gap-1.5">
                              <Checkbox
                                checked={activity.till_now}
                                onCheckedChange={(checked) =>
                                  updateActivity(actualIndex, "till_now", checked)
                                }
                              />
                              <Label className="text-xs cursor-pointer" onClick={() =>
                                updateActivity(actualIndex, "till_now", !activity.till_now)
                              }>
                                Till now
                              </Label>
                            </div>
                          </InputGroupAddon>
                        </InputGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Role/Position</Label>
                        <Input
                          value={activity.role_or_position || ""}
                          onChange={(e) =>
                            updateActivity(
                              actualIndex,
                              "role_or_position",
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
                        value={activity.email_address || ""}
                        onChange={(e) =>
                          updateActivity(
                            actualIndex,
                            "email_address",
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveActivities}>
              Save Changes
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ActivityHistoryModal;
