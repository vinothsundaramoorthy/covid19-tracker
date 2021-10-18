import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBoxes from "./InfoBoxes/InfoBoxes";
import { CountriesURL, WorldwideURL } from "./Constants/Constants";
import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
} from "@material-ui/core";
import Table from "./Table/Table";
import LineGraph from "./LineGraph/LineGraph";
import Map from "./Map/Map";
import { sortData, prettyPrintStat } from "./utils";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch(WorldwideURL)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch(CountriesURL)
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
          console.log(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "Worldwide"
        ? WorldwideURL
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;


    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // All of the data, from the country response
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Map */}
        </div>
        <div className="app__stats">
          <InfoBoxes
          isRed={true}
          active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Covid Cases"
            caseCount={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBoxes
          isRed={false}
          active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            caseCount={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBoxes
          isRed={true}
          active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            caseCount={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map casesType = {casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
            <h4>Live Cases By Country</h4>
            <Table countries={tableData} />
            <h4 className="app__graphTitle">World Wide {casesType} </h4>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
