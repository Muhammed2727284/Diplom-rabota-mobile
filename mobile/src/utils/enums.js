export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'];
export const WORK_FORMATS = ['OFFICE', 'REMOTE', 'HYBRID'];

export const EMPLOYMENT_TYPE_LABELS = {
  FULL_TIME: 'Полная занятость',
  PART_TIME: 'Частичная занятость',
  CONTRACT: 'Контракт',
  INTERN: 'Стажировка',
};

export const WORK_FORMAT_LABELS = {
  OFFICE: 'Офис',
  REMOTE: 'Удалённо',
  HYBRID: 'Гибрид',
};

export const APPLICATION_STATUS_LABELS = {
  SENT: 'Отправлен',
  VIEWED: 'Просмотрен',
  ACCEPTED: 'Принят',
  REJECTED: 'Отклонён',
};

export const getEmploymentLabel = (value) => EMPLOYMENT_TYPE_LABELS[value] || value;
export const getWorkFormatLabel = (value) => WORK_FORMAT_LABELS[value] || value;
export const getStatusLabel = (value) => APPLICATION_STATUS_LABELS[value] || value;
