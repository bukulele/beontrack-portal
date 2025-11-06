/**
 * Time Card Tab Component
 *
 * Main container for time card functionality. Manages:
 * - Attendance data fetching and state
 * - Period navigation (half-month view)
 * - Medical leave tracking
 * - Hours adjustments
 * - Edit state management
 * - API interactions with timezone handling
 *
 * Universal design - supports employee (and future driver support)
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from '@/lib/auth-client';
import { useLoader } from '@/app/context/LoaderContext';
import TimeCardHeader from './TimeCardHeader';
import TimeCardTable from './TimeCardTable';
import RemoteCheckinToggle from './RemoteCheckinToggle';
import MedicalLeaveCounter from './MedicalLeaveCounter';
import AdjustmentsTable from './AdjustmentsTable';
import MedicalLeaveDialog from './MedicalLeaveDialog';
import AdjustmentDialog from './AdjustmentDialog';
import MapDialog from './MapDialog';
import {
  calculateCurrentPeriod,
  transformToDayEntries,
  getTimezoneMessage,
  getPayDayString,
  prepareForApi,
  formatDateForInput,
} from './utils';

export default function TimeCardTab({ config, entityData }) {
  // Hooks
  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  // State
  const [period, setPeriod] = useState(calculateCurrentPeriod());
  const [attendanceData, setAttendanceData] = useState([]);
  const [medicalDaysLeft, setMedicalDaysLeft] = useState(
    config.features.medicalLeave.totalDaysPerYear
  );
  const [adjustments, setAdjustments] = useState([]);
  const [editState, setEditState] = useState({ mode: 'view' });
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);

  // Check if user has edit permissions
  const canEdit =
    userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER) ||
    userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN);

  // Hover handlers for precise button visibility control
  const handleHoverEntry = (entryId, field) => {
    if (!canEdit) return;
    setHoveredCell({ type: 'entry', entryId, field });
  };

  const handleHoverEmptyIn = (day) => {
    if (!canEdit) return;
    setHoveredCell({ type: 'emptyIn', day });
  };

  const handleHoverEmptyOut = (day, hasCheckIn) => {
    if (!canEdit) return;
    setHoveredCell({ type: 'emptyOut', day, hasCheckIn });
  };

  const handleHoverMedical = (day) => {
    if (!canEdit || medicalDaysLeft === 0) return;
    setHoveredCell({ type: 'medical', day });
  };

  const handleClearHover = () => {
    setHoveredCell(null);
  };

  // Transform attendance data to day entries
  const dayEntries = useMemo(
    () => transformToDayEntries(attendanceData, period),
    [attendanceData, period]
  );

  // Get timezone message
  const timezoneMessage = useMemo(
    () => getTimezoneMessage(config),
    [config]
  );

  // Load attendance data
  const loadAttendanceData = async () => {
    startLoading();
    try {
      const response = await fetch(
        `${config.api.attendance}/${entityData.id}/${period.year}`
      );
      if (!response.ok) throw new Error('Failed to fetch attendance data');
      const data = await response.json();
      setAttendanceData(data || []);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      stopLoading();
    }
  };

  // Load medical leave data
  const loadMedicalData = async () => {
    if (!config.features.medicalLeave.enabled) return;

    startLoading();
    try {
      const response = await fetch(
        `${config.api.medicalLeave}/${entityData.id}/${period.year}`
      );
      if (!response.ok) throw new Error('Failed to fetch medical leave data');
      const data = await response.json();
      setMedicalDaysLeft(
        config.features.medicalLeave.totalDaysPerYear - data.medical_shifts
      );
    } catch (error) {
      console.error('Failed to fetch medical leave data:', error);
    } finally {
      stopLoading();
    }
  };

  // Load adjustments data
  const loadAdjustments = async () => {
    if (!config.features.adjustments.enabled) return;

    const payDay = getPayDayString(period);
    startLoading();
    try {
      const response = await fetch(
        `${config.api.adjustments}/${entityData.id}/${payDay}`
      );
      if (!response.ok) throw new Error('Failed to fetch adjustments');
      const data = await response.json();
      setAdjustments(data || []);
    } catch (error) {
      console.error('Failed to fetch adjustments:', error);
    } finally {
      stopLoading();
    }
  };

  // Save attendance entry (create, update, or delete)
  const handleSave = async (entryId, field, value) => {
    startLoading();
    try {
      // Prepare value with timezone
      const valueWithTimezone = prepareForApi(value);

      let apiUrl = config.api.saveAttendance;
      let method = 'POST';

      const formData = new FormData();
      formData.append(config.entityType, entityData.id);

      if (entryId) {
        // Update or delete existing entry
        apiUrl += `/${entryId}`;
        method = 'PATCH';

        // Find the entry to preserve other field
        const entry = attendanceData.find(e => e.id === entryId);
        if (entry) {
          const checkInValue = field === 'check_in_time' ? valueWithTimezone : entry.check_in_time;
          const checkOutValue = field === 'check_out_time' ? valueWithTimezone : entry.check_out_time;

          // If both are empty, delete the entry
          if ((!checkInValue || checkInValue === '') && (!checkOutValue || checkOutValue === '')) {
            method = 'DELETE';
          } else {
            formData.append('check_in_time', checkInValue || '');
            formData.append('check_out_time', checkOutValue || '');
          }
        }
      } else {
        // Create new entry - send both fields, one will be empty
        if (field === 'check_in_time') {
          formData.append('check_in_time', valueWithTimezone || '');
          formData.append('check_out_time', '');
        } else {
          formData.append('check_in_time', '');
          formData.append('check_out_time', valueWithTimezone || '');
        }
      }

      const response = await fetch(apiUrl, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to save attendance');

      // Reload data
      await loadAttendanceData();
      setEditState({ mode: 'view' });
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      stopLoading();
    }
  };

  // Mark day as medical leave
  const handleConfirmMedical = async () => {
    if (editState.mode !== 'confirmMedical') return;

    const { day } = editState;
    startLoading();
    try {
      // 1. Delete all existing entries for that day
      const dayData = dayEntries.find(d => d.date === day);
      if (dayData && dayData.entries.length > 0) {
        await Promise.all(
          dayData.entries.map(entry =>
            fetch(`${config.api.saveAttendance}/${entry.id}`, { method: 'DELETE' })
          )
        );
      }

      // 2. Create medical leave entry with default times
      const medicalEntry = {
        check_in_time: formatDateForInput(
          period.year,
          period.month,
          day,
          parseInt(config.features.medicalLeave.defaultTimes.checkIn.split(':')[0]),
          parseInt(config.features.medicalLeave.defaultTimes.checkIn.split(':')[1]),
          parseInt(config.features.medicalLeave.defaultTimes.checkIn.split(':')[2] || 0)
        ),
        check_out_time: formatDateForInput(
          period.year,
          period.month,
          day,
          parseInt(config.features.medicalLeave.defaultTimes.checkOut.split(':')[0]),
          parseInt(config.features.medicalLeave.defaultTimes.checkOut.split(':')[1]),
          parseInt(config.features.medicalLeave.defaultTimes.checkOut.split(':')[2] || 0)
        ),
        medical: true,
      };

      const formData = new FormData();
      formData.append(config.entityType, entityData.id);
      formData.append('check_in_time', prepareForApi(medicalEntry.check_in_time));
      formData.append('check_out_time', prepareForApi(medicalEntry.check_out_time));
      formData.append('medical', true);

      await fetch(config.api.saveAttendance, {
        method: 'POST',
        body: formData,
      });

      // Reload data
      await loadAttendanceData();
      await loadMedicalData();
      setEditState({ mode: 'view' });
    } catch (error) {
      console.error('Failed to mark medical leave:', error);
    } finally {
      stopLoading();
    }
  };

  // Toggle remote check-in
  const handleToggleRemoteCheckin = async (value) => {
    if (!config.features.remoteCheckin.enabled) return;

    startLoading();
    try {
      const response = await fetch(config.api.updateEntity, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: entityData.id,
          [config.features.remoteCheckin.fieldName]: value,
          changed_by: session?.user?.name,
        }),
      });

      if (!response.ok) throw new Error('Failed to update remote check-in');

      // Update local entity data
      entityData[config.features.remoteCheckin.fieldName] = value;
    } catch (error) {
      console.error('Failed to update remote check-in:', error);
    } finally {
      stopLoading();
    }
  };

  // Delete adjustment
  const handleDeleteAdjustment = async (adjustmentId) => {
    startLoading();
    try {
      await fetch(`${config.api.deleteAdjustment}/${adjustmentId}`, {
        method: 'DELETE',
      });
      setAdjustments(prev => prev.filter(a => a.id !== adjustmentId));
    } catch (error) {
      console.error('Failed to delete adjustment:', error);
    } finally {
      stopLoading();
    }
  };

  // Add adjustment - open dialog
  const handleAddAdjustment = () => {
    setShowAdjustmentDialog(true);
  };

  // Save adjustment - API call
  const handleSaveAdjustment = async ({ hours, comment }) => {
    startLoading();
    try {
      const periodStartDay = period.half === 1 ? 1 : 16;
      const firstPayDay = `${period.year}-${String(period.month + 1).padStart(2, '0')}-${String(periodStartDay).padStart(2, '0')}`;

      const requestBody = {
        first_pay_day: firstPayDay,
        [config.entityType]: entityData.id,
        username: session?.user?.name,
        hours: hours,
        comment: comment,
      };

      const response = await fetch(config.api.adjustments, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to save adjustment');

      // Reload data
      await loadAdjustments();
      await loadAttendanceData();
      setShowAdjustmentDialog(false);
    } catch (error) {
      console.error('Failed to save adjustment:', error);
    } finally {
      stopLoading();
    }
  };

  // Load data on mount and period change
  useEffect(() => {
    if (!entityData?.id) return;
    loadAttendanceData();
    loadMedicalData();
    loadAdjustments();
  }, [entityData?.id, period.year]);

  // Reload adjustments when period changes
  useEffect(() => {
    if (!entityData?.id) return;
    loadAdjustments();
  }, [period.month, period.half]);

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-hidden">
      {/* Header with navigation */}
      <TimeCardHeader
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={loadAttendanceData}
        onAddAdjustment={
          config.features.adjustments.enabled && canEdit ? handleAddAdjustment : null
        }
        timezoneMessage={timezoneMessage}
      />

      {/* Remote check-in toggle */}
      {config.features.remoteCheckin.enabled && (
        <RemoteCheckinToggle
          enabled={entityData[config.features.remoteCheckin.fieldName]}
          onToggle={handleToggleRemoteCheckin}
          canEdit={canEdit}
        />
      )}

      {/* Medical leave counter */}
      {config.features.medicalLeave.enabled && (
        <MedicalLeaveCounter
          daysLeft={medicalDaysLeft}
          totalDays={config.features.medicalLeave.totalDaysPerYear}
          year={period.year}
        />
      )}

      {/* Time card table */}
      <TimeCardTable
        dayEntries={dayEntries}
        editState={editState}
        onEditStateChange={setEditState}
        onSave={handleSave}
        config={config}
        canEdit={canEdit}
        medicalDaysLeft={medicalDaysLeft}
        currentUserId={entityData.employee_id || entityData.driver_id}
        hoveredCell={hoveredCell}
        onHoverEntry={handleHoverEntry}
        onHoverEmptyIn={handleHoverEmptyIn}
        onHoverEmptyOut={handleHoverEmptyOut}
        onHoverMedical={handleHoverMedical}
        onClearHover={handleClearHover}
      />

      {/* Adjustments table */}
      {config.features.adjustments.enabled && (
        <AdjustmentsTable
          adjustments={adjustments}
          onDelete={handleDeleteAdjustment}
          onAdd={handleAddAdjustment}
          canEdit={canEdit}
        />
      )}

      {/* Modals */}
      {config.features.medicalLeave.enabled && (
        <MedicalLeaveDialog
          open={editState.mode === 'confirmMedical'}
          onConfirm={handleConfirmMedical}
          onCancel={() => setEditState({ mode: 'view' })}
        />
      )}

      {config.features.adjustments.enabled && (
        <AdjustmentDialog
          open={showAdjustmentDialog}
          onSave={handleSaveAdjustment}
          onCancel={() => setShowAdjustmentDialog(false)}
        />
      )}

      {config.features.gpsTracking.enabled && (
        <MapDialog
          open={editState.mode === 'viewMap'}
          coordinates={editState.coordinates}
          onClose={() => setEditState({ mode: 'view' })}
        />
      )}
    </div>
  );
}
