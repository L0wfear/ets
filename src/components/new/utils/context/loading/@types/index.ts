import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { LoadingServiceGeneric } from "./common";
import { CountryApi, TypesApi, AutobaseCarCategoryApi, AutobaseEngineTypeApi } from "./all";

type UrlValues = (
  CountryApi['url']
  | TypesApi['url']
  | AutobaseCarCategoryApi['url']
  | AutobaseEngineTypeApi['url']
);

export type LoadingService = (url: UrlValues) => {
  get: <ApiConfig extends LoadingServiceGeneric<any, any, any>>(payload: ApiConfig['payload'], meta: LoadingMeta) => Promise<ApiConfig['result']>;
};
