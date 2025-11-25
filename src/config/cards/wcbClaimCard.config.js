import { WCB_CLAIM_GENERAL_INFO_CONFIG } from "@/config/cards/wcbClaimGeneralInfo.config";
import { WCB_CLAIM_MEDICAL_CHECKLIST_CONFIG } from "@/config/checklists/wcbClaimMedicalChecklist.config";
import { WCB_CLAIM_DOCUMENTS_CHECKLIST_CONFIG } from "@/config/checklists/wcbClaimDocumentsChecklist.config";
import { wcbClaimLogConfig } from "@/config/cards/wcbClaimLog.config";
import { canAccessTab, getDocumentPermissions } from "@/config/entities/wcbClaims.config";

/**
 * WCB Claim Card Configuration for Universal Card System
 *
 * 4 tabs: general-info + medical-info + documents + notes
 */

export const WCB_CLAIM_CARD_CONFIG = {
  // Helper functions for permissions and access control
  canAccessTab,
  getDocumentPermissions,

  // Entity metadata
  entity: {
    type: "wcb_claims",
    contextProvider: "WcbClaimProvider",
    dataKey: "wcbClaimData",
    loadDataKey: "loadWcbClaimData",
  },

  // Card dimensions
  width: "w-[1024px]",
  height: "h-[95vh]",

  // Default tab
  defaultTab: "general-info",

  // Tabs configuration
  tabs: [
    {
      id: "general-info",
      label: "Claim Details",
      type: "general-info",
      config: WCB_CLAIM_GENERAL_INFO_CONFIG,
    },
    {
      id: "medical-info",
      label: "Medical Info",
      type: "checklist",
      config: WCB_CLAIM_MEDICAL_CHECKLIST_CONFIG,
    },
    {
      id: "documents",
      label: "Documents",
      type: "checklist",
      config: WCB_CLAIM_DOCUMENTS_CHECKLIST_CONFIG,
    },
    {
      id: "notes",
      label: "Notes",
      type: "log",
      config: wcbClaimLogConfig,
    },
  ],
};

export default WCB_CLAIM_CARD_CONFIG;
