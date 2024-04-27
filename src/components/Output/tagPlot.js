import { CanvasJS } from '../../lib/canvasjs.react'
import { CanvasJSChart } from '../../lib/canvasjs.react'
import { fusa_taxonomy } from '@data/fusa_taxonomy'

function filterPredictions (categoriesDict, threshold) {
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

function calculateMetrics (filteredPredictions, audioDuration) {
  let df = new Object()
  df = { event: [], duration_ratio: [], avg_acc: [] }
  let durationRatio = [],
    avgAcc = []
  for (let classTags in filteredPredictions) {
    avgAcc = 0
    let tags = filteredPredictions[classTags]
    let c = tags.length
    if (c > 0) {
      for (let tag of tags) {
        avgAcc += tag.probability
      }
      durationRatio = (c * 5) / audioDuration
      avgAcc = avgAcc / c
      let d = {
        event: classTags,
        duration_ratio: Math.round(durationRatio * 1000) / 1000,
        avg_acc: Math.round(avgAcc * 1000) / 1000
      }
      df.event.push(d.event)
      df.duration_ratio.push(d.duration_ratio)
      df.avg_acc.push(d.avg_acc)
    }
  }
  df.event.sort(function (b, a) {
    return df.avg_acc[df.event.indexOf(a)] - df.avg_acc[df.event.indexOf(b)]
  })
  df.duration_ratio.sort(function (b, a) {
    return df.avg_acc[df.event.indexOf(a)] - df.avg_acc[df.event.indexOf(b)]
  })
  df.avg_acc.sort(function (b, a) {
    return a - b
  })

  df.event = df.event.slice(0, 5)
  df.duration_ratio = df.duration_ratio.slice(0, 5)
  df.avg_acc = df.avg_acc.slice(0, 5)
  return df
}

const TagPlot = ({ modelOutput }) => {
  var audio_duration = modelOutput["audio_duration"]
  const threshold = 0.01
  var filtered_predictions = filterPredictions(modelOutput["audio_predictions"], threshold)
  var metrics = calculateMetrics(filtered_predictions, audio_duration)
  var events = metrics['event']
  var avg_accs = metrics['avg_acc']

  let data = []

  for (let i = 0; i < events.length; i++) {
    data.push({ y: avg_accs[i], label: fusa_taxonomy[events[i]]['description'] })
  }
  var maximum = 1.0
  if (data.length > 0) {
    var maxY = data.reduce((max, p) => p.y > max ? p.y : max, data[0].y)
    if (maxY < 0.9){
      maximum = maxY + 0.1
    }
  }

  const options = {
    animationEnabled: true,
    theme: 'light2',
    axisX: {
      title: 'Fuentes',
      reversed: true
    },
    axisY: {
      title: 'Probabilidad de presencia',
      includeZero: true,
      interval: 0.1,
      maximum: maximum,
      labelFormatter: function (e) {
      return CanvasJS.formatNumber(e.value, "0.#%");
      },
    },
    data: [
      {
        type: 'bar',
	yValueFormatString:"#.#%",
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
export default TagPlot
