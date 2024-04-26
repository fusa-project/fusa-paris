import client from '@util/api'
import moment from 'moment'

const handleRoadsSubmit = async (data, actions) => {
  var user_mail = 'labacam.fusa@gmail.com'

  var upload_timestamp = moment().unix()

  var categories = []
  if (data.labels) {
    for (let category of data.labels) {
      categories.push(
        {
          category_name: category,
          probability: 1.0,
        }
      )
    }
    var labels = [
      {
        username: user_mail,
        version: '',
        timestamp: upload_timestamp,
        categories: categories
      }]
  } else {
    var labels = []
  }

  var data = {
    name: data.name,
    description: data.description,
    audio: data.audio,
    video: data.video,
    recorded_at: moment(data.recorded_at).unix(),
    uploaded_at: upload_timestamp,
    latitude: data.latitude,
    longitude: data.longitude,
    labels: labels,
    period: data.period
  }

  return new Promise((resolve, reject) => {
    client
      .post('/predictions/roads', data)
      .then(function (res) {
        if (res.status == 200) {
          actions.resetForm()
          actions.setSubmitting(false)
          if (document.getElementById('audio.data')) {
            document.getElementById('audio.data').value = '';
          }
          if (document.getElementById('video.data')) {
            document.getElementById('video.data').value = '';
          }
        }
        resolve(res)
      })
      .catch(function (error) {
        console.log(error)
        resolve(error)
      })
  })
}
export default handleRoadsSubmit