import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine  } from "recharts";
import { Input } from "@/components/ui/input";
import { prepareChartData } from "@/features/stats/prepareChartData";

export default function StatsPage() {
  const [books, setBooks] = useState([]);
  const [graphType, setGraphType] = useState("booksRead");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [fictionFilter, setFictionFilter] = useState("all");
  const [monthRange, setMonthRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || user?.user?.id;
      if (!userId) return;

      const { data: booksData } = await supabase
        .from("user_books")
        .select(
          `*, book_genres ( genre_id, genres ( genre_name, fiction ) )`
        )
        .eq("user_id", userId)
        .not("date_finished", "is", null);

      const { data: genreList } = await supabase.from("genres").select("*");

      setBooks(booksData || []);
      setGenres(genreList || []);
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => {
    const bookGenres = book.book_genres?.map((g) => g.genres?.genre_name);
    const bookFiction = book.book_genres?.some((g) => g.genres?.fiction);

    const matchesGenres =
      selectedGenres.length === 0 ||
      bookGenres?.some((g) => selectedGenres.includes(g));
    const matchesFiction =
      fictionFilter === "all" ||
      (fictionFilter === "fiction" && bookFiction) ||
      (fictionFilter === "nonfiction" && !bookFiction);

    const finishedDate = book.date_finished
      ? format(new Date(book.date_finished), "yyyy-MM")
      : "";

    const inRange =
      (!monthRange.start || finishedDate >= monthRange.start) &&
      (!monthRange.end || finishedDate <= monthRange.end);

    return matchesGenres && matchesFiction && inRange;
  });

  const dataByMonth = {};
  filteredBooks.forEach((book) => {
    const month = format(new Date(book.date_finished), "yyyy-MM");
    if (!dataByMonth[month]) {
      dataByMonth[month] = { month, books: 0, pages: 0, ratings: [] };
    }
    dataByMonth[month].books += 1;
    dataByMonth[month].pages += book.pages || 0;
    if (book.rating) dataByMonth[month].ratings.push(book.rating);
  });

  const chartData = prepareChartData(dataByMonth);

  const averageValue =
  graphType === "booksRead"
    ? chartData.reduce((sum, d) => sum + d.books, 0) / chartData.length || 0
    : graphType === "pagesRead"
    ? chartData.reduce((sum, d) => sum + d.pages, 0) / chartData.length || 0
    : chartData.reduce((sum, d) => sum + d.rating, 0) / chartData.length || 0;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Reading Stats</h2>

      {/* Graph Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Graph Type */}
  <div className="p-3 border rounded bg-gray-100 dark:bg-gray-800">
    <Label className="mb-1 block">Graph Type</Label>
    <Select value={graphType} onValueChange={setGraphType}>
      <SelectTrigger>
        <SelectValue placeholder="Select graph type" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
        <SelectItem value="booksRead">Books Read Over Time</SelectItem>
        <SelectItem value="pagesRead">Pages Read Over Time</SelectItem>
        <SelectItem value="ratings">Ratings Over Time</SelectItem>
      </SelectContent>
    </Select>
  </div>

      {/* Fiction Filter */}
      <div className="p-3 border rounded bg-gray-100 dark:bg-gray-800">
        <Label className="mb-1 block">Fiction Filter</Label>
        <Select value={fictionFilter} onValueChange={setFictionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="nonfiction">Non-Fiction</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

      {/* Month Range Filters */}
      <div className="flex flex-wrap gap-4 mt-4">
        <div>
          <Label>Start Month</Label>
          <Input
            type="month"
            value={monthRange.start}
            onChange={(e) => setMonthRange({ ...monthRange, start: e.target.value })}
          />
        </div>
        <div>
          <Label>End Month</Label>
          <Input
            type="month"
            value={monthRange.end}
            onChange={(e) => setMonthRange({ ...monthRange, end: e.target.value })}
          />
        </div>
      </div>

      {/* Graph */}
      <Card>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
          {graphType === "ratings" ? (
  <LineChart data={chartData}>
    <XAxis dataKey="label" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
    <YAxis label={{ value: "Avg Rating", angle: -90, position: "insideLeft" }} />
    <Tooltip />
    <Bar dataKey={graphType === "booksRead" ? "books" : "pages"} fill="#4F46E5" />
    <ReferenceLine
      y={averageValue}
      stroke="red"
      strokeDasharray="4 4"
      ifOverflow="extendDomain"
      isFront={true}
      label={{
        position: "top",
        value: `Avg: ${averageValue.toFixed(2)}`,
        fill: "red",
        fontSize: 12
      }}
    />
    <Line type="monotone" dataKey="rating" stroke="#4F46E5" />
  </LineChart>
) : (
  <BarChart data={chartData}>
    <XAxis dataKey="label" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
    <YAxis
      label={{
        value: graphType === "pagesRead" ? "Pages" : "Books",
        angle: -90,
        position: "insideLeft"
      }}
    />
    <Tooltip />
    <Line type="monotone" dataKey="rating" stroke="#4F46E5" />
    <ReferenceLine
      y={averageValue}
      stroke="red"
      strokeDasharray="4 4"
      ifOverflow="extendDomain"
      isFront={true}
      label={{
        position: "top",
        value: `Avg: ${averageValue.toFixed(2)}`,
        fill: "red",
        fontSize: 12
      }}
    />
    <Bar
      dataKey={graphType === "booksRead" ? "books" : "pages"}
      fill="#4F46E5"
    />
  </BarChart>
)}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
