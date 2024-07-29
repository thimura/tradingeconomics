'use client';

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { getChartData } from "./api/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CustomSelect } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

/**
 * Chart component that displays a line chart comparing data for two selected countries.
 *
 * This component fetches and displays historical data for the selected countries and indicator.
 * It allows users to select countries from dropdown menus and updates the chart accordingly.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.countries - The list of countries to choose from.
 * @param {function} props.handleSelect1Change - Function to handle the change event of the first country select.
 * @param {function} props.handleSelect2Change - Function to handle the change event of the second country select.
 * @param {string} props.selectedCountry1 - The currently selected first country.
 * @param {string} props.selectedCountry2 - The currently selected second country.
 * @param {string} props.indicator - The indicator for which to fetch and display data.
 * @returns {JSX.Element} The rendered Chart component.
 */
export function Chart({ countries, handleSelect1Change, handleSelect2Change, selectedCountry1, selectedCountry2, indicator }) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartKey, setChartKey] = useState(0);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getChartData(selectedCountry1, selectedCountry2, indicator);
          if (data) {
            setChartData(data);
            setChartKey(prevKey => prevKey + 1); // ensuring that the key for the graph is changed so that the graph is rerendered

          } else {
            console.error("Fetched data is undefined");
          }

        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      }
  
      fetchData();
    }, [selectedCountry1, selectedCountry2]);

    const chartConfig = {
      country1: {
        label: selectedCountry1,
        color: "hsl(var(--chart-1))",
      },
      country2: {
        label: selectedCountry2,
        color: "hsl(var(--chart-2))",
      },
    };

    // if loading show the spinner
    if (loading) {
        return <div className="flex items-center justify-center"><LoadingSpinner/> </div>
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2"> {indicator} </CardTitle>
        <div className="flex items-center mb-12 space-x-4 ml-6">
          <CustomSelect
            countries={countries}
            selectedCountry={selectedCountry1}
            handleChange={handleSelect1Change}
            otherSelectedCountry={selectedCountry2}
            triggerClassName={`w-[${ Math.max(selectedCountry1.length, 150) }px]`}
            itemClassName=""
          />
          <span> VS </span>
          <CustomSelect
            countries={countries}
            selectedCountry={selectedCountry2}
            handleChange={handleSelect2Change}
            otherSelectedCountry={selectedCountry1}
            triggerClassName={`w-[${ Math.max(selectedCountry2.length, 150) }px]`}
            itemClassName=""
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            key={chartKey}
            data={chartData}
            margin={{
              left: 0,
              right: 30,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              // dataKey="year"
              dataKey="date"
              angle={-45}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line 
              connectNulls
              dataKey="country1"
              type="monotone"
              stroke="var(--color-country1)"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              connectNulls
              dataKey="country2"
              type="monotone"
              stroke="var(--color-country2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

