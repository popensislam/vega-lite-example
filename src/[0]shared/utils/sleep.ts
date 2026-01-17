export const sleep = (ms: number) => {
  return new Promise<void>((res) => setTimeout(res, ms));
};
