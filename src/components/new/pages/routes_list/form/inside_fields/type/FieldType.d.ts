export type PropsFieldType = {
  value: string | void;
  disabled: boolean;
  error: string;
  onChange: (obj: { [key: string]: any; }) => any;

  notTemplate?: boolean;
  fromMission?: boolean;
  available_route_types: Array<any>;
  page: string;
  path: string;
};

export type StateFieldType = {
  TYPES_OPTIONS: Array<{
    value: string;
    label: string;
  }>;
  available_route_types: Array<any>;
};
