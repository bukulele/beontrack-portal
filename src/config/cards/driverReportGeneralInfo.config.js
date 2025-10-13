/**
 * Driver Report Card - General Info Tab Configuration
 *
 * READ-ONLY DISPLAY PATTERN
 * This card is unique - it displays driver-submitted reports (accidents, tickets, injuries)
 * No editing, no file uploads. Special features:
 * - Two report types: Regular (AC/TK) vs Injury (IJ)
 * - Photo gallery with lightbox (non-injury only)
 * - GPS location with map modal
 * - PDF download
 * - Navigation to related entities
 * - Create new entity buttons (safety role)
 */

export const driverReportGeneralInfoConfig = {
  type: 'general-info-readonly', // Special read-only variant

  // Context access
  contextKey: 'driverReportData',

  // Conditional fields based on report type
  fieldsTemplate: (reportData) => {
    const isInjury = reportData?.type_of_report === 'IJ';
    return isInjury ? 'injury' : 'regular';
  },

  sections: [
    {
      title: null, // No section title, fields directly displayed
      collapsible: false,
      fields: {
        // REGULAR REPORT FIELDS (AC, TK)
        regular: [
          {
            key: 'id',
            label: 'Report Id',
            type: 'text',
            editable: false,
            // Special side buttons for Report ID field
            sideComponent: 'ReportIdActions', // Custom component
            // Actions: PDF download, related entities dropdowns, create entity button
          },
          {
            key: 'driver_id',
            label: 'Driver Id',
            type: 'driver-lookup', // Special type: looks up driver name from context
            editable: false,
            contextLookup: {
              source: 'hiredDriversList',
              idField: 'driver',
              displayFormat: (driver) =>
                `${driver?.first_name || ''} ${driver?.last_name || ''} ${driver?.driver_id || ''}`,
              fallbackField: 'driver_id',
            },
            sideComponent: 'OpenDriverCardButton', // Opens driver card
          },
          {
            key: 'date_time',
            label: 'Date and Time',
            type: 'datetime',
            editable: false,
          },
          {
            key: 'location',
            label: 'Location',
            type: 'text',
            editable: false,
            sideComponent: 'ViewOnMapButton', // Opens map modal with GPS coordinates
            sideCondition: (data) => data.gps_coordinates?.length > 0,
          },
          {
            key: 'type_of_report',
            label: 'Report Type',
            type: 'enum',
            editable: false,
            enumValues: 'REPORTS_TYPES', // Reference to enum in tableData
          },
          {
            key: 'truck_number',
            label: 'Truck Number',
            type: 'text',
            editable: false,
          },
          {
            key: 'trailer_number',
            label: 'Trailer Number',
            type: 'text',
            editable: false,
          },
          {
            key: 'description',
            label: 'Description',
            type: 'text',
            editable: false,
          },
          {
            key: 'steps_taken',
            label: 'Steps Taken',
            type: 'text',
            editable: false,
          },
        ],

        // INJURY REPORT FIELDS (IJ)
        injury: [
          {
            key: 'id',
            label: 'Report Id',
            type: 'text',
            editable: false,
            sideComponent: 'ReportIdActions',
          },
          {
            key: 'driver_id',
            label: 'Driver Id',
            type: 'driver-lookup',
            editable: false,
            contextLookup: {
              source: 'hiredDriversList',
              idField: 'driver',
              displayFormat: (driver) =>
                `${driver?.first_name || ''} ${driver?.last_name || ''} ${driver?.driver_id || ''}`,
              fallbackField: 'driver_id',
            },
            sideComponent: 'OpenDriverCardButton',
          },
          {
            key: 'date_time',
            label: 'Date and Time',
            type: 'datetime',
            editable: false,
          },
          {
            key: 'location',
            label: 'Location',
            type: 'text',
            editable: false,
            sideComponent: 'ViewOnMapButton',
            sideCondition: (data) => data.gps_coordinates?.length > 0,
          },
          {
            key: 'type_of_report',
            label: 'Report Type',
            type: 'enum',
            editable: false,
            enumValues: 'REPORTS_TYPES',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'text',
            editable: false,
          },
          {
            key: 'steps_taken',
            label: 'Steps Taken',
            type: 'text',
            editable: false,
          },
          {
            key: 'first_contact_after_injury',
            label: 'First Contact',
            type: 'text',
            editable: false,
          },
          {
            key: 'reported_to_doctor',
            label: 'Reported to Doctor',
            type: 'boolean-display', // Shows "Yes" or "No"
            editable: false,
          },
        ],
      },
    },
  ],

  // Photo gallery section (non-injury only)
  photoGallery: {
    enabled: true,
    condition: (data) => data?.type_of_report !== 'IJ',
    title: 'Driver Report photos',
    photoField: 'photos',
    gridCols: 5, // grid-cols-5
    lightbox: true, // Use lightbox plugin for full-screen viewing
    thumbnails: true, // Enable thumbnail navigation
  },

  // Special side components configuration
  sideComponents: {
    ReportIdActions: {
      component: 'ReportIdActionsComponent',
      props: {
        // PDF download button
        showPdfDownload: true,
        pdfEndpoint: '/api/get-driver-report-pdf',

        // Related entities dropdowns
        showRelatedEntities: true,
        relatedEntities: [
          {
            type: 'incidents',
            field: 'related_incidents',
            label: 'Go to incident',
            contextSource: 'incidentsList',
            displayField: 'incident_number',
            openCardType: 'incident',
          },
          {
            type: 'violations',
            field: 'related_violations',
            label: 'Go to violation',
            contextSource: 'violationsList',
            displayField: 'violation_number',
            openCardType: 'violation',
          },
          {
            type: 'wcbclaims',
            field: 'related_wcbclaims',
            label: 'Go to WCB claim',
            contextSource: 'wcbClaimsList',
            displayField: 'claim_number',
            openCardType: 'wcb',
          },
        ],

        // Create entity button (safety role only)
        showCreateButton: true,
        createButtonRoles: ['portalSafety'],
        createButtonConfig: {
          // Button label depends on report type
          labelMap: {
            TK: 'Create Violation',
            IJ: 'Create WCB Claim',
            AC: 'Create Accident',
          },
          // Object type to create
          objectTypeMap: {
            TK: 'violation',
            IJ: 'wcb',
            AC: 'incident',
          },
          // Pre-fill data from report
          serverDataBuilder: (reportData, contexts) => {
            const { activeTrucksList } = contexts;
            const { type_of_report } = reportData;

            const baseData = {
              assigned_to: '{{session.user.name}}',
              date_time: reportData.date_time,
              location: reportData.location,
              gps_coordinates: reportData.gps_coordinates,
              report: reportData.id,
            };

            if (type_of_report === 'TK') {
              // Violation
              return {
                ...baseData,
                main_driver_id: reportData.driver,
                truck: activeTrucksList?.find(t => t.unit_number == reportData.truck_number)?.id || '',
                trailer_1_unit_number: reportData.trailer_number,
                violation_details: reportData.description,
              };
            } else if (type_of_report === 'IJ') {
              // WCB Claim
              return {
                ...baseData,
                driver_id: reportData.driver,
                incident_details: reportData.description,
                reported_to_doctor: reportData.reported_to_doctor,
                first_contact_after_injury: reportData.first_contact_after_injury,
              };
            } else {
              // Incident
              return {
                ...baseData,
                main_driver_id: reportData.driver,
                truck: activeTrucksList?.find(t => t.unit_number == reportData.truck_number)?.id || '',
                trailer_1_unit_number: reportData.trailer_number,
                incident_details: reportData.description,
              };
            }
          },
          // Refresh data after creation
          afterCreateCallback: {
            refreshContexts: ['incidentsList', 'violationsList', 'wcbClaimsList', 'driverReportData'],
          },
        },
      },
    },

    OpenDriverCardButton: {
      component: 'OpenCardButton',
      props: {
        icon: 'faArrowUpRightFromSquare',
        cardType: 'driver',
        idField: 'driver',
        tooltip: 'Go To Driver Card',
        disabledCondition: (data) => !data.driver || data.driver.length === 0,
      },
    },

    ViewOnMapButton: {
      component: 'ViewOnMapButton',
      props: {
        icon: 'faGlobe',
        tooltip: 'View on map',
        coordinatesField: 'gps_coordinates',
        locationField: 'location',
        // Opens MapModalContainer with MapComponent
      },
    },
  },

  // No file sections for this card
  fileSections: null,

  // No action buttons at top/bottom
  actions: {
    top: [],
    bottom: [],
  },

  // No API endpoints (read-only)
  api: null,

  // Role restrictions (all can view)
  roles: {
    view: ['all'],
    edit: null, // No editing
    delete: null, // No deletion
  },
};
