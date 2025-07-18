export function formatarParaBRL(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarDataHoraBR(dataHoraStr) {
  const [data, hora] = dataHoraStr.split(" ");
  const [ano, mes, dia] = data.split("-");
  const [horas, minutos] = hora.split(":");
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}
