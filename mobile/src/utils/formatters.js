export const formatSalary = (from, to) => {
  if (from && to) return `${from.toLocaleString()} – ${to.toLocaleString()} сом`;
  if (from) return `от ${from.toLocaleString()} сом`;
  if (to) return `до ${to.toLocaleString()} сом`;
  return 'Не указана';
};
