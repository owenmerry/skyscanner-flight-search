export const waitSeconds = (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
export const getRandomNumber = (max: number) => {
  return Math.floor(Math.random() * max);
};
