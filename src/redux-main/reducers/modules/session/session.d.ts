export type OneSessionStructure = {
  name: string;
  id: number;
};

export type InitialStateSession = {
  userData: {
    structure_id: number | null;
    structure_name: string | null;
    structures: OneSessionStructure[];
    map_config: {
      zoom: number;
      coordinates: [number, number];
    },
    permissions: string[];
    permissionsSet: Set<string>;
    company_id: number | null;
    isOkrug: boolean;
    isKgh: boolean;
  };
  token: string | null;
  appConfig: {
    api_versions: string[];
    category_license: {
      category_drivers_license: [];
      category_special_license: [];
    };
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
  appConfigTracksCaching: {
    api_version_stable: number | null,
    api_versions: number[],
  }
};
