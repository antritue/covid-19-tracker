import {Circle, Popup} from 'react-leaflet'
import React from 'react'
import numeral from 'numeral'

export const sortData = (data) =>{
    return data.sort((a, b) => {return b.cases - a.cases})
}

const casesTypeColors = {
    cases:{
        hex: '#CC1034',
        multiplier: 400
    },
    recovered:{
        hex: '#7dd71d',
        multiplier: 400
    },
    deaths:{
        hex: '#6f3b5d',
        multiplier: 1500
    },
}

export const printStats = (stat) => (
    stat? `+ ${numeral(stat).format('0.0a')}`: '+ 0'
)
    
// draw circles on the map with interactive tooltip 
export const showDataOnMap = (data, casesTypes) =>(
    data.map(country =>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions = {{
                color: casesTypeColors[casesTypes].hex,
                fillColor: casesTypeColors[casesTypes].hex
            }}
            // color={casesTypeColors[casesTypes].hex}
            // fillColor={casesTypeColors[casesTypes].hex}
            radius={Math.sqrt(country[casesTypes]) * casesTypeColors[casesTypes].multiplier}
        >
            <Popup>
                <div className='info-container'>
                    <div className='info-flag'><img src={`${country.countryInfo.flag}`} alt={country.country} /></div>
                    <div className='info-name'>{country.country}</div>
                    <div className='info-cases'>Cases: {numeral(country.cases).format('0,0')}</div>
                    <div className='info-cases'>Recovered: {numeral(country.recovered).format('0,0')}</div>
                    <div className='info-cases'>Deaths: {numeral(country.deaths).format('0,0')}</div>
                </div>
            </Popup>
        </Circle>
    ))
)