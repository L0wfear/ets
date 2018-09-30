import { Button } from "react-bootstrap";

export type PropsRouteGeoList = {
  checkRoute?: React.MouseEventHandler<Button>;
  disabledCheckRoute?: boolean;
  type?: 'simple_dt' | 'mixed' | 'points',
  object_list?: any[],
  draw_object_list?: any[],
  fail_list?: any[],
};
