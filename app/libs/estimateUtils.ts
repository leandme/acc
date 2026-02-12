export const parsePercent = (raw: string) => {
  // handles "10", "10%", "Estimated: 10%", etc.
  const m = raw?.match(/(\d{1,2}(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  if (Number.isNaN(n)) return null;
  return n;
};

export const getCategoryMale = (p: number) => {
  if (p <= 5) return "ESSENTIAL";
  if (p <= 10) return "ATHLETIC ";
  if (p <= 13) return "LEAN";
  if (p <= 17) return "FIT";
  if (p <= 22) return "AVERAGE";
  if (p <= 26) return "ABOVE AVERAGE";
  if (p <= 30) return "HIGH";
  return  "VERY HIGH";
};

export const getCategoryFemale = (p: number) => {
  if (p <= 13) return "ESEENTIAL";
  if (p <= 20) return "ATHLETIC";
  if (p <= 24) return "LEAN";
  if (p <= 28) return "FIT";
  if (p <= 33) return "AVERAGE";
  if (p <= 38) return "ABOVE AVERAGE";
  if (p <= 43) return "HIGH";
  return  "VERY HIGH";
};


export const getRange = (p: number) => {
  const low = Math.max(3, Math.round(p - 10));
  const high = Math.min(60, Math.round(p + 10));
  return { low, high };
};

