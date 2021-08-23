import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox'
import LineGraph from './LineGraph';
import Map from './Map'
import Table from './Table'
import { printStats, sortData } from './util';
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState([10, 8])
  const [mapZoom, setMapZoom] = useState(2)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  // worldwide cards info 
  useEffect(() => {
    const getWorldWideData = async () => {
      await fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
    }
    getWorldWideData()
  }, [])

  // dropdown and table info
  useEffect(() => {
    const getCountriesData = async () =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(((resoponse) => resoponse.json()))
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo._id
          }
        ))
        
        const sortedData = sortData(data)
        setTableData(sortedData)
        setCountries(countries)
        setMapCountries(data)
      })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value
    setCountry(countryCode)

    if(countryCode==='worldwide'){
      const url = 'https://disease.sh/v3/covid-19/all'
      await fetch(url)
      .then((resoponse) => resoponse.json())
      .then((data) => {
        setCountryInfo(data)
        setMapCenter([10, 8])
        setMapZoom(2)
      })
    } else{
      const url = `https://disease.sh/v3/covid-19/countries/${countryCode}?yesterday=true`
      await fetch(url)
      .then((resoponse) => resoponse.json())
      .then((data) => {
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
    }
  }


  return (
    <>
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1>COVID-19 tracker</h1>
            <FormControl className='app__dropdown'>
              <Select 
                variant='outlined' 
                value={country}
                onChange={onCountryChange}
              >
                <MenuItem value='worldwide'>Worldwide</MenuItem>
                {
                  countries.map(country => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            <InfoBox 
              active = {casesType === 'cases'}
              casesType = {casesType}
              onClick = {() => setCasesType('cases')}
              title='Corona virus case'
              cases={printStats(countryInfo.todayCases)}
              total={printStats(countryInfo.cases)} 
            />
            <InfoBox 
              active = {casesType === 'recovered'}
              casesType = {casesType}
              onClick = {() => setCasesType('recovered')}
              title='Recovered' 
              cases={printStats(countryInfo.todayRecovered)} 
              total={printStats(countryInfo.recovered)} />
            <InfoBox 
              active = {casesType === 'deaths'}
              casesType = {casesType}
              onClick = {() => setCasesType('deaths')}
              title='Deaths' 
              cases={printStats(countryInfo.todayDeaths)} 
              total={printStats(countryInfo.deaths)} 
            />
          </div>

          <Map casesType={casesType} center={mapCenter} zoom={mapZoom} countries={mapCountries}/>
        </div>
        
        <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3>Worlwide new {casesType}</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
        </Card>
        
      </div>
      <div className="footer">
        <p>Made by Tue An - 2021</p>
        <p>Made by Tue An - 2021</p>
      </div>
    </>
  );
}

export default App;
