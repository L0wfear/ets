export type InitialStateSession = {
  userData: {
    structure_id: number | null;
    structure_name: string | null;
    structures: {
      name: string;
      id: number;
    }[];
    map_config: {
      zoom: number;
      coordinates: [number, number];
    },
    permissions: string[];
    company_id: number | null;
    isOkrug: boolean;
    isKgh: boolean;
  };
  token: string | null;
  appConfig: {
    enums: {
      FUEL_TYPE: any,
    },
    defaults: {
      FUEL_TYPE: string | null,
    },
    shift: {
      shift_end: string | null, // todo: сделать вызов тех же методов что и в факсограмме
      shift_start: string | null, // todo: сделать вызов тех же методов что и в факсограмме
    },
    summer_start: [number, number];
    summer_end: [number, number];
    footer_url: string | null,
    project_name: string | null,
  };
};
