import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { LoadingServiceGeneric } from "./common";
import {
  CountryApi,
  TypesApi,
  AutobaseCarCategoryApi,
  AutobaseEngineTypeApi,
  TimeApi,
  AutobaseActualBatteriesOnCarApi,
  AutobaseActualTiresOnCarApi,
  MeasureUnitApi,
  CompanyStructureLinearApi,
  EmployeeApi,
} from "./all";

type UrlValues = (
  CountryApi['url']
  | TypesApi['url']
  | AutobaseCarCategoryApi['url']
  | AutobaseEngineTypeApi['url']
  | TimeApi['url']
  | AutobaseActualBatteriesOnCarApi['url']
  | AutobaseActualTiresOnCarApi['url']
  | MeasureUnitApi['url']
  | CompanyStructureLinearApi['url']
  | EmployeeApi['url']
);

export type LoadingService = (url: UrlValues) => {
  get: <ApiConfig extends LoadingServiceGeneric<any, any, any>>(payload: ApiConfig['payload'], meta: LoadingMeta) => Promise<ApiConfig['result']>;
};
