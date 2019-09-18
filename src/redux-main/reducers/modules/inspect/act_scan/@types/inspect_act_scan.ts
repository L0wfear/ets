export type InspectActScan = {
  company_id: number;
  content_type: string;
  created_at: string;
  id: number;
  kind: string;
  name: string;
  notes: string;
  object_id: number;
  status: string;
  subdir: string;
  updated_at: string;
  url: string;
};

export type InspectOneActScan = {
  id: number;
  name: string;
  inspection_id: number;
  files: any[],
  notes: string;
};
