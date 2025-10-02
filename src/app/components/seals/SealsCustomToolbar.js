import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";

function CustomToolbar({ driverTextData }) {
  const customStyle = {
    m: 0, // Equivalent to Tailwind m-0
    p: 0.5, // Equivalent to Tailwind p-1
    backgroundColor: "rgb(214 211 209)", // Equivalent to Tailwind bg-stone-200
    borderRadius: "4px", // Equivalent to Tailwind rounded
    fontWeight: "normal", // Equivalent to Tailwind font-normal
    cursor: "pointer", // Equivalent to Tailwind cursor-pointer
    transition: "none",
    color: "black",
    "&:hover": {
      backgroundColor: "#b92531", // Equivalent to Tailwind hover:bg-[#b92531]
      color: "white", // Equivalent to Tailwind hover:text-white
    },
    "&:active": {
      backgroundColor: "rgb(234, 88, 12)", // Equivalent to Tailwind active:bg-orange-600
    },
  };

  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter
        debounceMs={300}
        placeholder="Search…"
        style={{ flex: 1, marginRight: 8 }}
      />
      <GridToolbarExport
        printOptions={{ disableToolbarButton: true }}
        csvOptions={{
          fileName: driverTextData,
          utf8WithBom: true,
        }}
        slotProps={{ button: { sx: customStyle } }}
      />
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
