export type PropsFieldType = {
  value: string | void;
  disabled: boolean;
  error: string;
  onChange: (obj: { [key: string]: any }) => any;

  notTemplate?: boolean;
  fromMission?: boolean;
  available_route_types: any[];
  page: string;
  path: string;
};

export type StateFieldType = {
  TYPES_OPTIONS: {
    value: string,
    label: string,
  }[];
  available_route_types: any[];
};
