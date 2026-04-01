export const formatSalary = (from, to) => {
  if (from && to) return `${from.toLocaleString()} – ${to.toLocaleString()} ₸`;
  if (from) return `от ${from.toLocaleString()} ₸`;
  if (to) return `до ${to.toLocaleString()} ₸`;
  return 'Не указана';
};
