export const largeNumberFormatter = (number: number) => {
  let formattedNumber: string = number.toString();

  if (number / 1000000 >= 1) {
    formattedNumber = (number / 1000000).toFixed(2) + "M";
  }
  if (number / 1000000000 >= 1) {
    formattedNumber = (number / 1000000000).toFixed(2) + "B";
  }
  if (number / 1000000000000 >= 1) {
    formattedNumber = (number / 1000000000000).toFixed(2) + "T";
  }

  return formattedNumber;
};

export const percentageFormatter = (number: number) => {
  return number.toFixed(2) + "%";
};
