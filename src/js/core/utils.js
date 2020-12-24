export const fomatNumber = (num) => {
  return num.toLocaleString('ru-RU', {
    maximumFractionDigits: 0
  });
};

export const convertNumber = (labelValue) => {
  return Math.abs(Number(labelValue)) >= 1.0e+9
    ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
    : Math.abs(Number(labelValue)) >= 1.0e+6
      ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
      : Math.abs(Number(labelValue)) >= 1.0e+3
        ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"
        : Math.abs(Number(labelValue));
}
