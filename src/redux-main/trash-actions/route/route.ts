import {
  getRouteDataById,
  getRouteValidate,
  postCreateRoute,
  putUpdateRoute,
} from 'redux-main/trash-actions/route/promise';
import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

export const loadRouteDataById = (type, id, meta = { loading: true } as TypeMeta) => ({
  type,
  payload: getRouteDataById(id),
  meta: {
    ...meta,
  },
});

export type RouteFormStateType = {
  id?: number;
  is_main: boolean;
  name: string | null;
  municipal_facility_id: number | null;
  municipal_facility_name?: string;
  technical_operation_id: number | null;
  technical_operation_name?: string;
  structure_id: number | null;
  structure_name?: string;
  type: string | null;
  object_list: any[];
  input_lines: any[];
  draw_object_list?: any[];
};

export type CreateRouteActionAns = ETSCore.Respoce.Payload<{ route: RouteFormStateType }>;

export type CreateRouteAction = (
  type: string | null,
  formState: any,
  isTemplate: boolean,
  loadObj: {
    page: string | null;
    path: string | null;
  },
) => Promise<{
  type: string | null,
  payload: CreateRouteActionAns,
  meta: {
    promise: boolean;
    page: string | null;
    path: string | null;
  },
}>;

export const validateRoute: any = (type, formState, { page, path }) => ({
  type,
  payload: getRouteValidate(formState),
  meta: {
    promise: true,
    page,
    path,
  },
});

export const createRoute: any = (type, formState, isTemplate, { page, path }) => ({
  type,
  payload: postCreateRoute(formState, isTemplate),
  meta: {
    promise: true,
    page,
    path,
  },
});

export const updateRoute: any = (type, formState, { page, path }) => ({
  type,
  payload: putUpdateRoute(formState),
  meta: {
    promise: true,
    page,
    path,
  },
});
