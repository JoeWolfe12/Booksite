import { parse, format, addMonths, differenceInMonths } from "date-fns";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"];

export function prepareChartData(dataByMonth) {
  // 1) Turn raw data into a sorted array of month-entries
  const monthsData = Object.entries(dataByMonth)
    .map(([dateStr, entry]) => {
      const date = parse(dateStr, "yyyy-MM", new Date());
      const avgRating =
        entry.ratings?.length
          ? entry.ratings.reduce((s, r) => s + Number(r), 0) / entry.ratings.length
          : 0;
      return {
        year: date.getFullYear(),
        monthNum: date.getMonth(),
        books: entry.books,
        pages: entry.pages,
        rating: avgRating,
        label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
      };
    })
    .sort((a, b) =>
      a.year !== b.year ? a.year - b.year : a.monthNum - b.monthNum
    );

  // If there’s no data, bail out
  if (monthsData.length === 0) return [];

  // 2) Figure the span from first to last month
  const startDate = parse(
    `${monthsData[0].year}-${String(monthsData[0].monthNum + 1).padStart(2, "0")}`,
    "yyyy-MM",
    new Date()
  );
  const endData = monthsData[monthsData.length - 1];
  const endDate = parse(
    `${endData.year}-${String(endData.monthNum + 1).padStart(2, "0")}`,
    "yyyy-MM",
    new Date()
  );
  const spanMonths = differenceInMonths(endDate, startDate);

  // 3) Walk each month in the span, pulling existing or zero-filled
  const full = [];
  for (let i = 0; i <= spanMonths; i++) {
    const current = addMonths(startDate, i);
    const year = current.getFullYear();
    const monthNum = current.getMonth();
    const label = `${MONTHS[monthNum]} ${year}`;
    const found = monthsData.find(
      (d) => d.year === year && d.monthNum === monthNum
    );
    full.push(
      found || { year, monthNum, books: 0, pages: 0, rating: 0, label }
    );
  }

  return full;
}