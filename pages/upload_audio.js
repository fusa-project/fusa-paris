import { useState, useEffect, useRef } from 'react'
import { Flex, Stack } from '@chakra-ui/react'
import { Formik, Form, ErrorMessage } from 'formik'
import { Grid, Backdrop, CircularProgress } from '@mui/material'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Title from '@components/title'
import SubmitButton from '@components/submitButton'
import NameInput from '@components/Input/nameInput'
import DescriptionInput from '@components/Input/descriptionInput'
import CoordsInput from '@components/Input/coordsInput'
import SelectInput from '@components/Input/selectInput'
import AudioFileInput from '@components/Input/audioFileInput'
import DateInput from '@components/Input/dateInput'
import CheckboxInput from '@components/Input/checkboxInput'
import InstructionsDialogButton from '@components/instructionsDialogButton'
import handleSubmit from '@components/submitForm'
import { initialValues, validationSchema } from '@components/formData'
import GeneralSnackbars from '@components/generalSnackbars'
import AudioClassificationDialog from '@components/Output/audioClassificationDialog'

const MapWithNoSSR = dynamic(
  () => {
    return import('@components/map')
  },
  {
    ssr: false
  }
)

const UploadAudio = props => {

  //Map coords
  const [position, setPosition] = useState({ lat: '', lng: '' })

  function MapCoords(event) {
    setPosition(event.latlng)
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (location) {
        var coords = {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
        setPosition(coords)
      })
    }
  }, [])

  // Alerts
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openFailed, setOpenFailed] = useState(false)
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway' || reason === 'timeout') {
      return
    }
    setOpenSuccess(false)
  }
  const handleCloseFailed = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenFailed(false)
  }

  // Loading
  const [loading, setLoading] = useState(false)

  //Submit
  const submitButtonRef = useRef()

  const [modelOutput, setModelOutput] = useState({
    "audio_predictions": {},
    "audio_duration": 0
  })
  const submitForm = (data, actions) => {
    setLoading(true)
    handleSubmit(data, actions).then(res => {
      console.log(res.data.data)
      console.log(res.data.data.labels[1])
      console.log(res.data.data.labels[1].predictions)
      console.log(res.data.data.duration)
      if (res.status == 200 && res.data.data.labels[1].predictions.code != 503) {
        setOpenSuccess(true)
        var audio_predictions = res.data.data.labels[1].predictions
        var audio_duration = res.data.data.duration
        setModelOutput({
          "audio_predictions": audio_predictions,
          "audio_duration": audio_duration
        })
      } else setOpenFailed(true)
      setLoading(false)
    })
  }

  //Form

  return (
    <div>
      <Grid container justifyContent='center' spacing={2}>
        <GeneralSnackbars
          openSuccess={openSuccess}
          handleCloseSuccess={handleCloseSuccess}
          openFailed={openFailed}
          handleCloseFailed={handleCloseFailed}
        />
        <AudioClassificationDialog
          openSuccess={openSuccess}
          handleCloseSuccess={handleCloseSuccess}
          modelOutput={modelOutput}
          modelType={"TAG"}
        />
        <Grid item xs={12}>
          <Head>
            <title>Subida de Audio</title>
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <Grid container justifyContent='center'>
            <Title label={'Formulario de subida de audio'} />
            <InstructionsDialogButton />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Flex flexDirection='column' justifyContent='center'>
            <MapWithNoSSR onClick={MapCoords} />
          </Flex>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Formik
            initialValues={{
              ...initialValues
            }}
            onSubmit={submitForm}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, isValid }) => (
              <Stack alignItems='left' spacing='10px'>
                <Form>
                  <Grid container justifyContent='center'>
                    <AudioFileInput name='audio.data' />
                  </Grid>
                  <Grid container justifyContent='center'>
                    <div style={{ "color": "#f00" }}>
                      <ErrorMessage name="audio.data" />
                    </div>
                  </Grid>
                  <NameInput name='name' label='Nombre de audio' />
                  <SelectInput
                    name='recording_device'
                    label='Dispositivo de grabación'
                  />
                  <Grid container>
                    <Grid item sm={6} xs={6}>
                      <CoordsInput
                        name='latitude'
                        label='Latitud'
                        values={position.lat}
                      />
                    </Grid>
                    <Grid item sm={6} xs={6}>
                      <CoordsInput
                        name='longitude'
                        label='Longitud'
                        values={position.lng}
                      />
                    </Grid>
                  </Grid>
                  <DateInput
                    name='recorded_at'
                    label='Fecha/hora de grabación'
                  />
                  <CheckboxInput name='tags' label='Categorías' />
                  <DescriptionInput name='description' label='Descripción' />
                  <button
                    type='submit'
                    style={{ display: 'none' }}
                    ref={submitButtonRef}
                  />
                </Form>
              </Stack>
            )}
          </Formik>
        </Grid>
        <Grid item xs={12}>
          <SubmitButton
            disabled={loading}
            onClick={() => {
              submitButtonRef.current.click()
            }}
          />
        </Grid>
      </Grid>
      {loading && (
        <Backdrop
          className='backdrop'
          style={{ zIndex: '1000' }}
          open={loading}
        >
          <CircularProgress size={50} color='primary' />
        </Backdrop>
      )}
    </div>
  )
}

export default UploadAudio