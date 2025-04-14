import { parse, format } from "date-fns";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function prepareChartData(dataByMonth) {
  return Object.entries(dataByMonth)
    .map(([dateStr, entry]) => {
      const date = parse(dateStr, "yyyy-MM", new Date());
      return {
        ...entry,
        year: date.getFullYear(),
        monthNum: date.getMonth(), // 0-indexed
        label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNum - b.monthNum;
    });
}