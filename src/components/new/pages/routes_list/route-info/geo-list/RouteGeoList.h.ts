import * as Button from 'react-bootstrap/lib/Button';

export type PropsRouteGeoList = {
  checkRoute?: React.MouseEventHandler<Button>;
  disabledCheckRoute?: boolean;
  type?: 'simple_dt' | 'mixed' | 'points',
  object_list?: any[],
  draw_object_list?: any[],
  makeFailList?: boolean,
  polys?: any;
  height?: string;
};
