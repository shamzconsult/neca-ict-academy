import { baseURL } from "./baseUri";
import { getAPIData } from "./getAPIData";

export const getDynamicParams = async <T>(
  params: T | Promise<T>
): Promise<T> => {
  return params instanceof Promise ? await params : params;
};

export const fetchCohortData = async () => {
  try {
    const data = await getAPIData({ uri: `${baseURL}/api/cohort` });
    return data;
  } catch (error) {
    console.error("Error loading data", error);
    return [];
  }
};
