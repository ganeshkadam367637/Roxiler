// Charts.jsx
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/accessibility';

import axios from 'axios';

const Charts = () => {
    const [chartData, setChartData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('01');
    const categories = ['0-100', '100-200', '200-300', '300-400', '400-500', '500-600', '600-700', '700-800', '800-900', '901+'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('roxiler.com/product_transaction.json');
                const data = response.data;

                const monthData = data.filter((item) => {
                    const date = new Date(item.dateOfSale);
                    return date.getMonth() + 1 === parseInt(selectedMonth);
                });

            const transformedData = categories.map((range) => {
                if (range === '901+') {
                    return monthData.filter((item) => item.price > 900).length;
                }
                const [min, max] = range.split('-').map(Number);
                return monthData.filter((item) => item.price >= min && item.price < max).length;
            });

                setChartData(transformedData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        fetchData();
    }, [selectedMonth]);

    const chartOptions = {
        accessibility: {
            enabled: false
        },
        chart: {
          type: 'column',
          height: 420,  
          width: 800,   
          spacingTop: 20, 
          spacingBottom: 0, 
          spacingLeft: 20, 
          spacingRight: 20, 
          style: {
            fontFamily: 'Arial, sans-serif'
          },
         
        },
        title: {
          text: `Bar Chart Status : ${selectedMonth}` ,
          style: { color: 'rgba(0,0,0)' }

        },
        // show categories and percentages one below one using html 
        xAxis: {
            categories: categories,

            title: { text: 'Price Ranges', style: { color: 'rgba(0,0,0,1)' } },
            tickmarkPlacement: 'off',
            gridLineWidth: 0,
            labels: { style: { color: 'rgba(0,0,0,1)' } }
        },
        yAxis: {
          allowDecimals: false,
          title: {
            text: ''
          },
          lineWidth: 2,  
          lineColor: '#ADADAD' , 
              // y axis scale mark 
          gridLineWidth: 0,
          max: 20,
          tickInterval: 5,    
        },
        series: [
          {
            name: '',
            data: chartData,
            color: 'rgba(0, 255, 255, 0.5)',
            marker: {
                enabled: false // Disable markers
            }
          }],
              
        plotOptions: {
            series: {
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    style: { color: '#ffffff' },
                     y: 0, 
                     
                    },
                    pointWidth: 60 ,// Set the desired width for the bars
                    pointPadding: 0.8, // Adjust the spacing between bars within a category
                    groupPadding: 2,
            }
        },
        legend: {
            itemStyle: { color: '#ffffff' }
        }    
      };
    return (
        <div className='border border-info' >
            <div className="d-flex justify-content-center mt-5">
            <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth} className=''  >
                <option  value="01">January  </option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
            </div>  
             <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};
export default Charts;
