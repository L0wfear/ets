export type OneSessionStructure = {
  name: string;
  id: number;
};

export type OneSessionCompany = {
  asuods_id: number;
  name: string;
};

export type InitialStateSession = {
  userData: {
    structure_id: number | null;
    structure_name: string | null;
    structures: OneSessionStructure[];
    map_config: {
      zoom: number;
      coordinates: [number, number];
    };
    permissions: string[];
    permissionsSet: Set<string>;
    company_id: number | null;
    isOkrug: boolean;
    isKgh: boolean;
    isGlavControl: boolean;
    companies: OneSessionCompany[] | null;
    company_name: string | null;
    fio: string | null;
    default_path: string | null;
    first_name: string | null;
    last_name: string | null;
    login: string | null;
    middle_name: string | null;
    okrug_id: string | number | null;
    okrug_name: string | null;
    role: string | null;
    stableRedirect: string | null;
    user_id: number | null;
  };
  token: string | null;
  appConfig: {
    api_versions: string[];
    category_license: {
      category_drivers_license: [];
      category_special_license: [];
    };
    points_ws: string;
    enums: {
      FUEL_TYPE: object;
    };
    defaults: {
      FUEL_TYPE: string | null;
    };
    shift: {
      shift_end: string | null; // todo: сделать вызов тех же методов что и в факсограмме
      shift_start: string | null; // todo: сделать вызов тех же методов что и в факсограмме
    };
    summer_start: [number, number];
    summer_end: [number, number];
    summer_start_date: string;
    summer_end_date: string;
    footer_url: string | null;
    project_name: string | null;
    can_switch_api_version?: boolean;
  };
  appConfigTracksCaching: {
    api_version_stable: number | null;
    api_versions: number[];
  };
};
