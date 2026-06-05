export const fieldScanMeta = {
  title: "Field Intelligence Scan",
  subtitle:
    "Upload satellite or drone imagery to perform deep AI canopy analysis and health diagnostics.",
} as const;

export const comparisonMeta = {
  title: "Post-Analysis Comparison",
  badge: "Live Satellite: May 24, 2024",
  originalLabel: "Original View",
  aiLabel: "AI Vision Active",
  originalImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA723kN5NB_4olsp_OJMgLbGRgB3BdIaGWjjOCpsHnUpBml_CjDLmvHz61SVItSeSU1ERRQfQ0bCNavd1idzxdgnN16IENFGYPcu66CDqmUmK7UNE45yYVV4lRN0UBs-KCwkOS-MwwwUsqLNVmjiptdA3kKvJ3pzW8gREslcCncoNcWdgQjewZXZbvpXl8K9LHbI6A8okFRp7ElHTtMtngHGx2IO3o1S3p141DIh9xjxe0XyIRdMQeLrB3BoOVsCl7gmUfnTOLtl-Ye",
  aiImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCCazbW-hHyxk7yZCVErkyB1yBsXcim5R6XoTfw_hV159wRrZ22xfWQHHYSON76XKYn5HeG2pReDqsIdFEuUHtmOJuW4P2jm7zBAMUoz6l78b0Dndeusm8m3DvfmreYd_g8NQnUym_zXy42RxNEGTFySqA5vorwwzmORu3a5YJDARJQgubG45IUa3IO09OIbOaGWIEXu2u_eIz2o_vUbmY65WHQnnePjrp32QwV53lZUDYJFkV6x-dmnJ3LWXcxnKRdnGnxUoXIwyJQ",
  overlayMarkers: [
    { top: "25%", left: "25%", pulse: true },
    { top: "50%", left: "33%", pulse: false },
    { top: "33%", right: "25%", pulse: false },
    { bottom: "25%", right: "33%", pulse: true },
  ],
} as const;

export const healthDistribution = {
  segments: [
    { label: "Healthy", value: 60, color: "primary" as const },
    { label: "Needs Care", value: 30, color: "secondary" as const },
    { label: "Replacement", value: 10, color: "error" as const },
  ],
} as const;

export const fieldStats = {
  treeCount: "1,240",
  density: { value: "120", unit: "per acre" },
} as const;

export type Observation = {
  icon: string;
  title: string;
  detail: string;
  severity: "secondary" | "error" | "primary";
};

export const observations: Observation[] = [
  {
    icon: "warning",
    title: "Low nitrogen levels detected in NW quadrant",
    detail:
      "Spectral signatures suggest a 15% deficit. Recommended targeted fertilization within 48 hours to prevent stunted growth.",
    severity: "secondary",
  },
  {
    icon: "coronavirus",
    title: "Signs of early leaf spot in 5% of canopy",
    detail:
      "Localized in the central-east sector. Immediate physical inspection of tree IDs #452 to #488 suggested.",
    severity: "error",
  },
  {
    icon: "check_circle",
    title: "Optimal water retention in Southern plots",
    detail:
      "Soil moisture levels are within 95% of target parameters. Maintain current irrigation schedule.",
    severity: "primary",
  },
];

export const uploadConfig = {
  icon: "potted_plant",
  title: "Drag farm imagery here or",
  browseLabel: "Browse Files",
  hint: "Supports TIFF, JPG, PNG (Max 50MB)",
  analyzeLabel: "Analyze Field",
} as const;
