import React from 'react'
import {MapContainer , TileLayer, Popup, useMap, Circle} from 'react-leaflet'
import "./Map.css"
import numeral from 'numeral'
// import { showDataOnMap } from './util';


function ChangeMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
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

// draw circles on the map with interactive tooltip 
const showDataOnMap = (data, casesTypes) =>(
    data.map(country =>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions = {{
                color: casesTypeColors[casesTypes].hex,
                fillColor: casesTypeColors[casesTypes].hex
            }}
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

function Map({countries, casesType, center, zoom}) {
    return (
        <div className='map'>
            <MapContainer scrollWheelZoom={true}>
                <ChangeMap center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map
