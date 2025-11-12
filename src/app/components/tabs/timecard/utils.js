/**
 * Utility functions for Time Card Tab
 */

import isValidDate from '@/app/functions/isValidDate';
import calculateWorkingHours from '@/app/functions/calculateWorkingHours';
import getFriendlyZoneName from '@/app/functions/getFriendlyZoneName';
import safeToIsoWithOffset from '@/app/functions/safeToIsoWithOffset';

/**
 * Transform flat attendance array to day-grouped entries
 * @param {Array} attendanceData - Array of attendance records
 * @param {Object} period - {year, month, half}
 * @returns {Array} Array of {date, entries[]} objects
 */
export function transformToDayEntries(attendanceData, period) {
  if (!attendanceData || attendanceData.length === 0) {
    const days = generateDays(period);
    return days.map(day => ({ date: day, entries: [] }));
  }

  const days = generateDays(period);

  return days.map(day => {
    const entries = attendanceData
      .filter(entry => isSameDay(entry, day, period))
      .sort((a, b) => {
        // Sort by clockInTime, fallback to clockOutTime
        const timeA = new Date(a.clockInTime || a.clockOutTime || 0);
        const timeB = new Date(b.clockInTime || b.clockOutTime || 0);
        return timeA - timeB;
      });

    return { date: day, entries };
  });
}

/**
 * Generate array of day numbers for current period
 * @param {Object} period - {year, month, half}
 * @returns {Array} Array of day numbers
 */
export function generateDays(period) {
  const start = period.half === 1 ? 1 : 16;
  const end = period.half === 1 ? 15 : new Date(period.year, period.month + 1, 0).getDate();
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Check if entry belongs to specific day and period
 * @param {Object} entry - Attendance entry
 * @param {number} day - Day of month
 * @param {Object} period - {year, month, half}
 * @returns {boolean}
 */
function isSameDay(entry, day, period) {
  const checkTime = entry.clockInTime || entry.clockOutTime;
  if (!checkTime) return false;

  const date = new Date(checkTime);
  return (
    date.getFullYear() === period.year &&
    date.getMonth() === period.month &&
    date.getDate() === day
  );
}

/**
 * Calculate current period (year, month, half)
 * @returns {Object} {year, month, half}
 */
export function calculateCurrentPeriod() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    half: now.getDate() <= 15 ? 1 : 2,
  };
}

/**
 * Format period as label string
 * @param {Object} period - {year, month, half}
 * @returns {string} e.g., "1 - 15 January 2025"
 */
export function formatPeriodLabel(period) {
  const monthName = new Date(period.year, period.month).toLocaleString('default', {
    month: 'long',
  });
  const endDay = period.half === 1
    ? 15
    : new Date(period.year, period.month + 1, 0).getDate();
  const startDay = period.half === 1 ? 1 : 16;

  return `${startDay} - ${endDay} ${monthName} ${period.year}`;
}

/**
 * Calculate total hours for a single day
 * @param {Array} entries - Array of attendance entries for the day
 * @param {Object} config - Time card configuration
 * @returns {number} Total hours (decimal)
 */
export function calculateDayHours(entries, config) {
  if (!entries || entries.length === 0) return 0;

  const total = entries.reduce((sum, entry) => {
    const hours = parseFloat(
      calculateWorkingHours(entry.clockInTime, entry.clockOutTime, false)
    );
    return sum + (isNaN(hours) ? 0 : hours);
  }, 0);

  // Apply lunch deduction if configured and threshold met
  if (
    config.calculations.lunchDeduction &&
    total >= config.calculations.lunchDeductionThreshold
  ) {
    return total - (config.calculations.lunchDeductionMinutes / 60);
  }

  return total;
}

/**
 * Calculate total hours for entire period
 * @param {Array} dayEntries - Array of day entries from transformToDayEntries
 * @param {Object} config - Time card configuration
 * @returns {number} Total hours (decimal)
 */
export function calculatePeriodTotal(dayEntries, config) {
  if (!dayEntries || dayEntries.length === 0) return 0;

  return dayEntries.reduce((sum, day) => {
    return sum + calculateDayHours(day.entries, config);
  }, 0);
}

/**
 * Format decimal hours as "Xh Ymin"
 * @param {number} decimalHours - Hours in decimal format
 * @returns {string} Formatted string
 */
export function formatHours(decimalHours) {
  if (isNaN(decimalHours) || decimalHours === 0) return '-';

  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  if (hours + minutes === 0) return '-';

  return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
}

/**
 * Check if entry has third-party login warning
 * @param {Object} entry - Attendance entry
 * @param {string} field - 'in' | 'out'
 * @param {string} currentUserId - Current user's ID
 * @returns {boolean}
 */
export function hasThirdPartyWarning(entry, field, currentUserId) {
  const userIds = field === 'in' ? entry.user_id_in : entry.user_id_out;
  if (!userIds) return false;

  const ids = userIds.split(',').map(id => id.trim()).filter(Boolean);

  // If multiple IDs exist, or the single ID doesn't match current user
  return ids.length > 1 || (ids.length === 1 && ids[0] !== currentUserId);
}

/**
 * Format datetime for display in user's local timezone
 * @param {string} isoString - ISO datetime string (with or without timezone)
 * @returns {string} Formatted datetime in local timezone or '-'
 */
export function formatDateTime(isoString) {
  if (!isoString || !isValidDate(isoString)) return '-';
  // Parse and display in user's local timezone
  const date = new Date(isoString);
  return date.toLocaleString();
}

/**
 * Prepare datetime value for API submission (add timezone offset)
 * Ensures all datetime values sent to server have timezone information
 * @param {string} value - Datetime string from input
 * @returns {string} ISO string with timezone offset
 */
export function prepareForApi(value) {
  if (!value) return '';
  return safeToIsoWithOffset(value);
}

/**
 * Get timezone message based on config
 * @param {Object} config - Time card configuration
 * @returns {string} Timezone message
 */
export function getTimezoneMessage(config) {
  if (config.display.timezoneMode === 'static') {
    return `Time is shown in ${config.display.staticTimezone} time zone`;
  }

  // Dynamic - get user's timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const city = getFriendlyZoneName(timeZone);
  return `You are working in ${city} time zone`;
}

/**
 * Format date for API submission (ISO with offset)
 * @param {number} year - Year
 * @param {number} month - Month (0-indexed)
 * @param {number} day - Day of month
 * @param {number} hours - Hours (default 0)
 * @param {number} minutes - Minutes (default 0)
 * @param {number} seconds - Seconds (default 0)
 * @returns {string} ISO datetime string
 */
export function formatDateForInput(
  year,
  month,
  day,
  hours = 0,
  minutes = 0,
  seconds = 0
) {
  const date = new Date(year, month, day, hours, minutes, seconds);
  return date.toISOString();
}

/**
 * Get pay day string for adjustments API
 * @param {Object} period - {year, month, half}
 * @returns {string} e.g., "2025-06-01" or "2025-06-16"
 */
export function getPayDayString(period) {
  const day = period.half === 1 ? '01' : '16';
  const month = String(period.month + 1).padStart(2, '0');
  return `${period.year}-${month}-${day}`;
}

/**
 * Get all unique third-party user IDs for tooltip display
 * @param {Array} entries - Array of entries for a day
 * @param {string} currentUserId - Current user's ID
 * @returns {Array|null} Array of unique user IDs or null
 */
export function getThirdPartyUserIds(entries, currentUserId) {
  const allThirdPartyIds = [];

  entries.forEach(entry => {
    const inIds = parseUserIds(entry.user_id_in, currentUserId);
    const outIds = parseUserIds(entry.user_id_out, currentUserId);
    allThirdPartyIds.push(...inIds, ...outIds);
  });

  const uniqueIds = [...new Set(allThirdPartyIds)];
  return uniqueIds.length > 0 ? uniqueIds : null;
}

/**
 * Parse comma-separated user IDs and filter out current user
 * @param {string} userIdString - Comma-separated user IDs
 * @param {string} currentUserId - Current user's ID to exclude
 * @returns {Array} Array of user IDs (excluding current user)
 */
function parseUserIds(userIdString, currentUserId) {
  if (!userIdString) return [];

  return userIdString
    .split(',')
    .map(id => id.trim())
    .filter(id => id && id !== currentUserId);
}
