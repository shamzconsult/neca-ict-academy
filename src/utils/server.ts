export const getDynamicParams = async <T>(
  params: T | Promise<T>
): Promise<T> => {
  return params instanceof Promise ? await params : params;
};
