export type GpsCoordinates = {
  latitude: number;
  longitude: number;
  altitude?: number;
};

export type OverviewStat = {
  label: string;
  value: string;
  icon?: string;
};

export type ExifTableRow = {
  name: string;
  description: string;
  value: string;
  category: string;
};

export type PrivacyFlag = {
  id: string;
  label: string;
  severity: "high" | "medium" | "low";
  detail: string;
};

export type PrivacyReport = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  flags: PrivacyFlag[];
};

export type ParsedImageExif = {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl: string;
  width: number;
  height: number;
  hasExif: boolean;
  overview: OverviewStat[];
  gps: GpsCoordinates | null;
  tableRows: ExifTableRow[];
  rawJson: Record<string, { description: string; value: unknown }>;
  privacy: PrivacyReport;
  dominantColors: string[];
  histogram: number[];
  fileHash: string;
  aspectLabel: string;
};
