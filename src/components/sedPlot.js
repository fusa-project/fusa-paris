import { CanvasJS } from '../lib/canvasjs.react'
import { CanvasJSChart } from '../lib/canvasjs.react'
import { fusa_taxonomy } from '@data/fusa_taxonomy'

function filterPredictions(categoriesDict, threshold) {
    let filteredDict = {}
    for (let key in categoriesDict) {
        let valuesList = []
        for (let i = 0; i < categoriesDict[key].length; i++) {
            if (categoriesDict[key][i]['probability'] > threshold) {
                valuesList.push(categoriesDict[key][i])
            }
        }
        filteredDict[key] = valuesList
    }
    return filteredDict
}

function getDescription(categoriesDict, label) {
    for (let key in categoriesDict) {
        if (categoriesDict.hasOwnProperty(clave)) {
            if (categoriesDict[key].SPASS && categoriesDict[key].SPASS.includes(label)) {
                return categoriesDict[key].description;
            }
        }
    }
    return null; // Si no se encuentra ninguna descripción para "river"
}

const SEDPlot = ({ modelOutput }) => {
    var audio_duration = modelOutput[1] * 1000
    var default_date = (new Date(2023, 0, 0, 0, 0)).getTime()
    const threshold = 0.1

    var filtered_predictions = filterPredictions(modelOutput[0], threshold)

    let data = []
    let counter = 1
    Object.entries(filtered_predictions).forEach(([label, intervals], index) => {
        console.log(label, intervals)
        console.log(getDescription(fusa_taxonomy, label))
        intervals.forEach(interval => {
            data.push({
                x: counter,
                label: getDescription(fusa_taxonomy, label),
                y: [default_date + interval.begin * 1000, default_date + interval.end * 1000],
		pbb: interval.probability,
		color: fusa_taxonomy[label]['color']
            });
        });
        if (intervals.length > 0){
            counter++
        }
    });

    const options = {
        animationEnabled: true,
        theme: 'light2',
        axisX: {
            title: 'Tiempo',
            reversed: true
        },
        axisY: {
            title: 'Fuentes',
            includeZero: true,
            minimum: default_date,
            interval: (1000 * 5),
            labelFormatter: function (e) {
                return CanvasJS.formatDate(e.value, "mm:ss");
            },
            gridThickness: 0,
            maximum: default_date + audio_duration,
        },

        toolTip: {
            contentFormatter: function (e) {
	        return "<strong>" + e.entries[0].dataPoint.label + "</strong></br> Probabilidad: " + (e.entries[0].dataPoint.pbb.toFixed(2))* 100 + "%</br>Inicio: " + CanvasJS.formatDate(e.entries[0].dataPoint.y[0], "mm:ss") + "</br>Fin : " + CanvasJS.formatDate(e.entries[0].dataPoint.y[1], "mm:ss");
            }
        },

        data: [
            {
                type: "rangeBar",
                dataPoints: data
            }
        ]

    }
    return (
        <div>
            <CanvasJSChart
                options={options}
            />
        </div>
    )
}
export default SEDPlot
