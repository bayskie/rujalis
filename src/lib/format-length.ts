export const formatLength = (value: number): string => {
  if (value < 1000) {
    return `${new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2,
    }).format(value)} m`;
  }

  const km = value / 1000;

  if (km >= 1000) {
    return `${new Intl.NumberFormat("id-ID", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(km)} km`;
  }

  return `${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(km)} km`;
};
