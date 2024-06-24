const date = (
  date: Date,
  options?: Intl.DateTimeFormatOptions,
) => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "America/Sao_Paulo",
    ...options,
  }).format(date);
};

const FormatterUtil = {
  date,
};

export default FormatterUtil;
