import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { ForecastData } from "@/api/types";
import { Button } from "./ui/button";

interface WeatherForecastProps {
  data?: ForecastData; // Make data optional since we're adding manual data
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const daysPerPage = 5;
  
  // Manual data for the next 5 days
  const manualForecastData = [
    {
      date: Math.floor(new Date(2025, 4, 9).getTime() / 1000), // May 9, 2025
      temp_min: 18,
      temp_max: 24,
      humidity: 65,
      wind: 3.2,
      weather: {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d"
      }
    },
    {
      date: Math.floor(new Date(2025, 4, 10).getTime() / 1000), // May 10, 2025
      temp_min: 17,
      temp_max: 25,
      humidity: 70,
      wind: 4.1,
      weather: {
        id: 801,
        main: "Clouds",
        description: "few clouds",
        icon: "02d"
      }
    },
    {
      date: Math.floor(new Date(2025, 4, 11).getTime() / 1000), // May 11, 2025
      temp_min: 15,
      temp_max: 22,
      humidity: 75,
      wind: 5.3,
      weather: {
        id: 500,
        main: "Rain",
        description: "light rain",
        icon: "10d"
      }
    },
    {
      date: Math.floor(new Date(2025, 4, 12).getTime() / 1000), // May 12, 2025
      temp_min: 16,
      temp_max: 23,
      humidity: 68,
      wind: 4.8,
      weather: {
        id: 802,
        main: "Clouds",
        description: "scattered clouds",
        icon: "03d"
      }
    },
    {
      date: Math.floor(new Date(2025, 4, 13).getTime() / 1000), // May 13, 2025
      temp_min: 19,
      temp_max: 26,
      humidity: 60,
      wind: 2.9,
      weather: {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d"
      }
    }
  ];

  // Process actual data if provided
  let actualDays: DailyForecast[] = [];
  
  if (data) {
    // Process real data as before
    const dailyForecasts = data.list.reduce((acc, forecast) => {
      const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

      if (!acc[date]) {
        acc[date] = {
          temp_min: forecast.main.temp_min,
          temp_max: forecast.main.temp_max,
          humidity: forecast.main.humidity,
          wind: forecast.wind.speed,
          weather: forecast.weather[0],
          date: forecast.dt,
        };
      } else {
        acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
        acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
      }

      return acc;
    }, {} as Record<string, DailyForecast>);

    // Get next 5 days from the actual data
    actualDays = Object.values(dailyForecasts).slice(1, 6);
  }
  
  // Combine actual data with manual data
  const allDays = [...actualDays, ...manualForecastData];
  
  // Calculate pagination
  const totalPages = Math.ceil(allDays.length / daysPerPage);
  const startIndex = (currentPage - 1) * daysPerPage;
  const displayDays = allDays.slice(startIndex, startIndex + daysPerPage);
  
  // Handle pagination
  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Format temperature
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          {currentPage === 1 ? "5-Day Forecast" : `Extended Forecast (Days ${startIndex + 1}-${Math.min(startIndex + daysPerPage, allDays.length)})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {displayDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <span className="flex items-center text-blue-500">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center text-red-500">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="flex justify-end gap-4">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.humidity}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.wind}m/s</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center pt-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}