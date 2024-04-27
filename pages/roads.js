import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router';
import { Flex, Stack } from '@chakra-ui/react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Grid, Backdrop, CircularProgress } from '@material-ui/core'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Title from '@components/title'
import SubmitButton from '@components/submitButton'
import NameInput from '@components/Input/nameInput'
import DescriptionInput from '@components/Input/descriptionInput'
import CoordsInput from '@components/Input/coordsInput'
import SwitchInput from '@components/Input/switchInput'
import AudioFileInput from '@components/Input/audioFileInput'
import VideoFileInput from '@components/Input/videoFileInput'
import DateInput from '@components/Input/dateInput'
import CheckboxRoadsInput from '@components/Input/checkboxRoadsInput'
import InstructionsDialogButton from '@components/instructionsDialogButton'
import handleRoadsSubmit from '@components/submitRoadsForm'
import { initialRoadsValues, validationRoadsSchema } from '@components/formData'
import GeneralSnackbars from '@components/generalSnackbars'
import RoadsReportDialog from '@components/Output/roadsReportDialog'

const MapWithNoSSR = dynamic(
  () => {
    return import('@components/map')
  },
  {
    ssr: false
  }
)

const FusaRoads = props => {
  const router = useRouter();
  const { type } = router.query;

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
    "audio_output": {},
    "audio_duration": 0,
    "video_predictions": {},
    "video_output": {},
    "video_duration": 0
  })
  const submitForm = (data, actions) => {
    setLoading(true)
    handleRoadsSubmit(data, actions).then(res => {
      if (res.status == 200) {
        setOpenSuccess(true)
        var audio_predictions;
        var video_predictions;
        var audio_output;
        var video_output;
        console.log("RES.DATA", res.data['audio'], res.data['video'])
        if (res.data['audio']) {
          audio_predictions = res.data['audio'].predictions;
          audio_output = res.data['audio'].output;
        } else {
          audio_predictions = {};
          audio_output = {};
        }
        if (res.data['video']) {
          video_predictions = res.data['video'].predictions;
          video_output = res.data['video'].output;
        } else {
          video_predictions = {};
          video_output = {};
        }
        var audio_duration = data.audio.duration
        var video_duration = data.video.duration
        setModelOutput({
          "audio_predictions": audio_predictions,
          "audio_output": audio_output,
          "audio_duration": audio_duration,
          "video_predictions": video_predictions,
          "video_output": video_output,
          "video_duration": video_duration,
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
        <RoadsReportDialog
          openSuccess={openSuccess}
          handleCloseSuccess={handleCloseSuccess}
          modelOutput={modelOutput}
        />
        <Grid item xs={12}>
          <Head>
            <title>FuSA ROADS</title>
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <Grid container justifyContent='center'>
            <Title label={'FuSA ROADS'} />
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
              ...initialRoadsValues
            }}
            onSubmit={submitForm}
            validationSchema={validationRoadsSchema}
          >
            {({ isSubmitting, isValid }) => (
              <Stack alignItems='left' spacing='10px'>
                <Form>
                  <Grid container justifyContent='center' spacing={2}>
                    {type === 'video' && (
                      <Grid item xs={6}>
                        <Grid container justifyContent='center' alignItems='center'>
                          <VideoFileInput name='video.data' />
                        </Grid>
                        <div style={{ "color": "#f00" }}>
                          <ErrorMessage name="video.data" />
                        </div>
                      </Grid>
                    )}
                    {type === 'audio' && (
                      <Grid item xs={6}>
                        <Grid container justifyContent='center' alignItems='center'>
                          <AudioFileInput name='audio.data' />
                        </Grid>
                        <div style={{ "color": "#f00" }}>
                          <ErrorMessage name="audio.data" />
                        </div>
                      </Grid>
                    )}
                  </Grid>
                  <NameInput name='name' label='Título' />
                  <Grid container>
                    <DateInput
                      name='recorded_at'
                      label='Fecha/hora de grabación'
                    />
                    <SwitchInput
                      name='period'
                      label='Período'
                    />
                  </Grid>
                  <Grid container>
                    <Grid item sm={6} xs={6}>
                      <CoordsInput
                        type='hidden'
                        name='latitude'
                        label='Latitud'
                        values={position.lat}
                      />
                    </Grid>
                    <Grid item sm={6} xs={6}>
                      <CoordsInput
                        type='hidden'
                        name='longitude'
                        label='Longitud'
                        values={position.lng}
                      />
                    </Grid>
                  </Grid>
                  <CheckboxRoadsInput name='tags' label='Categorías' />
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

export default FusaRoads