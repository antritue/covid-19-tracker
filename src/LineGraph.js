import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2'

const options = {
    legend: {
        // plugins:{
            display: false
        // }
    },
    elements:{
        point: {
            radius: 0
        }
    },
    // maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0.0")
            }
        }
    },
    scales:{
        xAxes: [
            {
                type: 'time',
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: 'll'
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks:{
                    callback: function(value, index, values){
                        return numeral(value).format('0a')
                    }
                }
            }
        ]
    }
}

const casesTypeColors = {
    cases:{
        hex: '#CC1034',
        backgroundColor: '#e395a1'
    },
    recovered:{
        hex: '#7dd71d',
        backgroundColor: '#c3e598'
    },
    deaths:{
        hex: '#6f3b5d',
        backgroundColor: '#bda7b1'
    },
}

const buildChartData = (data, casesType) =>{
    let chartData = []
    let lastDataPoint;
    for(let date in data[casesType]) {
        if(lastDataPoint){
            let newCases = data[casesType][date] - lastDataPoint
            const newDataPoint = {
                x: date,
                y: newCases >= 0 ? newCases : 0
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date]
    }
    return chartData
}

function LineGraph({casesType}) {
    const [data, setData] = useState({})

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
        .then((response) => response.json())
        .then((data) =>{
            // console.log(data);
            const chartData = buildChartData(data, casesType)
            setData(chartData)
        })
    }, [casesType])

    return (
        <div className='app__graph'>
            {data?.length >0 &&(
                <Line 
                    data = {{
                        datasets: [
                            {
                                label: casesType,
                                data: data,
                                borderColor: casesTypeColors[casesType].hex,
                                backgroundColor: casesTypeColors[casesType].backgroundColor
                            }
                        ]
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        scales:{
                            y: {
                                ticks:{
                                    callback: function(value){
                                        return numeral(value).format('0a')
                                    }
                                }
                            }
                        },
                        animation: false,
                        plugins: {
                            legend: {
                                display: false,
                            }
                        }
                    }}
                />
            )}
        </div>
    )
}

export default LineGraph
