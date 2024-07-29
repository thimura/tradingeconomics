'use client'

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CustomSelect,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getTableData } from "./api/api";
import { ChartDialog } from "@/components/ui/dialog";


const countries = ["Mexico", "New Zealand", "Sweden", "Thailand"]; // countries that I can access as a free user
const indicatorsMagnitude = {
    "GDP": "USD Billion", 
    "Population": "Million", 
    "Interest Rate": "Percent", 
    "Inflation Rate": "Percent", 
    "Current Account": "SEK Billion", 
    "Unemployment Rate": "Percent", 
    "Balance of Trade": "SEK Million", 
    "Government Debt": "SEK Million"
};

export default function Home() {
  // countries that are selected for comparison
  const [selectedCountry1, setSelectedCountry1] = useState('');
  const [selectedCountry2, setSelectedCountry2] = useState('');

  // data about the countries selected to be displayed in the table
  const [country1Data, setCountry1Data] = useState({});
  const [country2Data, setCountry2Data] = useState({});
  const [error, setError] = useState(null);


  // handling the change of the selected country
  const handleSelect1Change = async (value) => {
    if (value !== selectedCountry2) {
      setSelectedCountry1(value);
    }
  };

  const handleSelect2Change = async (value) => {
    if (value !== selectedCountry1) {
      setSelectedCountry2(value);
    }
  };

  // use effect hooks to fetch data of the selected countries
  useEffect(() => {
    const fetchDataCountry1 = async () => {
      try {
        if (selectedCountry1) {
          const tempCountry1Data = await getTableData(selectedCountry1);
          setCountry1Data(tempCountry1Data);
        }
      } catch (error) {
          setError(error);
      }
    };

    fetchDataCountry1();
  }, [selectedCountry1]);

  useEffect(() => {
    const fetchDataCountry2 = async () => {
      try {
        if (selectedCountry2) {
          const tempCountry2Data = await getTableData(selectedCountry2);
          setCountry2Data(tempCountry2Data);
        }
      } catch (error) {
          setError(error);
      }
    };

    fetchDataCountry2();
  }, [selectedCountry2]);

  // to check if either country1Data or country2Data have values in it
  const hasValues = (data) => {
    // Check if the object is not empty and has at least one key with a non-null value
    return Object.keys(data).length > 0 && Object.values(data).some(value => value !== null && value !== undefined && value !== '');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="absolute top-0 right-0 m-4">
        <ThemeToggle />
      </div>

      <header className="mt-8 ml-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Compare Countries
        </h1>
      </header>

      { !(selectedCountry1) ? (
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 48px)' }}>
          <CustomSelect
            countries={countries}
            selectedCountry={selectedCountry1}
            handleChange={handleSelect1Change}
            otherSelectedCountry={selectedCountry2}
            triggerClassName="w-[300px] text-3xl p-4 h-[80px]"
            itemClassName="text-2xl p-4"
            />
        </div>
        ): null 
      }
      {selectedCountry1 && !(hasValues(country1Data)) ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div> 
        ) : null
      }
    
      { (hasValues(country1Data) || hasValues(country2Data)) ? (
        <div className="flex items-center justify-center h-screen mx-auto px-1 w-full max-w-6xl mb-16">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>
                  <CustomSelect
                    countries={countries}
                    selectedCountry={selectedCountry1}
                    handleChange={handleSelect1Change}
                    otherSelectedCountry={selectedCountry2}
                    triggerClassName={`w-[${selectedCountry1.length * 8 + 20}px]`}
                    itemClassName=""
                  />
                </TableHead>
                <TableHead>
                  <CustomSelect
                    countries={countries}
                    selectedCountry={selectedCountry2}
                    handleChange={handleSelect2Change}
                    otherSelectedCountry={selectedCountry1}
                    triggerClassName={`w-[${selectedCountry2.length * 8 + 20}px]`}
                    itemClassName=""
                  />
                </TableHead>
                <TableHead> Difference </TableHead>
                <TableHead> Magnitude </TableHead>
                <TableHead className="text-center"> Over the years </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(new Set([...Object.keys(country1Data)])).map((indicator) => (
                <TableRow key={indicator}>
                  <TableCell className="font-medium">{indicator}</TableCell>
                  <TableCell>
                    {country1Data[indicator] !== undefined ? typeof country1Data[indicator] !== 'string' ? Number(country1Data[indicator]).toFixed(2) : country1Data[indicator] : '---'}
                  </TableCell>
                  <TableCell>
                    {country2Data[indicator] !== undefined ? typeof country2Data[indicator] !== 'string' ? Number(country2Data[indicator]).toFixed(2) : country2Data[indicator] : '---'}
                  </TableCell>
                  <TableCell>
                    {(typeof country1Data[indicator] === 'number' && typeof country2Data[indicator] === 'number') ? 
                        <div className={(country1Data[indicator] - country2Data[indicator] > 0) ? 'text-green-500' : 'text-red-500'}>
                            {(country1Data[indicator] - country2Data[indicator]).toFixed(2)}
                        </div>
                        : 
                        '---'
                    }
                  </TableCell>
                  <TableCell> {indicatorsMagnitude[indicator]} </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                        <ChartDialog 
                          countries={countries} 
                          handleSelect1Change={handleSelect1Change} 
                          handleSelect2Change={handleSelect2Change} 
                          selectedCountry1={selectedCountry1} 
                          selectedCountry2={selectedCountry2} 
                          indicator={indicator}
                        />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        ) : null 
      }
    </div>
  );
}
