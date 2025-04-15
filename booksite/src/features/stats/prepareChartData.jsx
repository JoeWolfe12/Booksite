import { parse, format } from "date-fns";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function prepareChartData(dataByMonth) {
  return Object.entries(dataByMonth)
    .map(([dateStr, entry]) => {
      const date = parse(dateStr, "yyyy-MM", new Date());

      // Calculate average rating
      const averageRating =
        entry.ratings && entry.ratings.length > 0
          ? entry.ratings.reduce((sum, r) => sum + Number(r), 0) / entry.ratings.length
          : 0;

      return {
        books: entry.books,
        pages: entry.pages,
        rating: averageRating, // this is what your graph needs
        label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
        year: date.getFullYear(),
        monthNum: date.getMonth(),
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNum - b.monthNum;
    });
}
