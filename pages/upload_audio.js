import { useState, useEffect, useRef } from 'react'
import { Flex, Stack } from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import { Grid, Backdrop, CircularProgress } from '@material-ui/core'
import Head from 'next/head'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import Title from '@components/title'
import SubmitButton from '@components/submitButton'
import NameInput from '@components/Input/nameInput'
import DescriptionInput from '@components/Input/descriptionInput'
import CoordsInput from '@components/Input/coordsInput'
import SelectInput from '@components/Input/selectInput'
import FileInput from '@components/Input/fileInput'
import DateInput from '@components/Input/dateInput'
import CheckboxInput from '@components/Input/checkboxInput'
import InstructionsDialogButton from '@components/instructionsDialogButton'
import handleSubmit from '@components/submitForm'
import { initialValues, validationSchema } from '@components/formData'
import GeneralSnackbars from '@components/generalSnackbars'
import ClassificationDialog from '@components/classificationDialog'

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

  function MapCoords (event) {
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
    if (reason === 'clickaway') {
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

  const [modelOutput, setModelOutput] = useState({})
  const submitForm = (data, actions) => {
    setLoading(true)
    handleSubmit(data, actions).then(res => {
      if (res.status == 200) {
        setOpenSuccess(true)
        var model_tags = res.data.data.tags[1].categories
        model_tags.map((tag, i) => {
          setModelOutput(tag)
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
          <ClassificationDialog
            openSuccess={openSuccess}
            handleCloseSuccess={handleCloseSuccess}
            modelOutput={modelOutput}
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
                      <FileInput name='data' />
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
                    <Field type='hidden' name='file' />
                    <Field type='hidden' name='user' />
                    <Field type='hidden' name='audio_duration' />
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
