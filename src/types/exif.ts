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

export type ParsedImageExif = {
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
};
