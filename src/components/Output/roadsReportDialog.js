import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Button
} from '@material-ui/core'
import { useState, forwardRef } from 'react'
import AudioReportOutput from '@components/Output/audioReportOutput'
import VideoReportOutput from '@components/Output/videoReportOutput'
import AudioClassificationDialog from '@components/Output/audioClassificationDialog'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const RoadsReportDialog = ({
  openSuccess,
  handleCloseSuccess,
  modelOutput
}) => {
  const [openClassificationDialog, setOpenClassificationDialog] = useState(false);
  const isAudio = Object.keys(modelOutput["audio_output"]).length !== 0;
  const isVideo = Object.keys(modelOutput["video_output"]).length !== 0;

  const handleOpenClassificationDialog = () => {
    setOpenClassificationDialog(true);
  };

  const handleCloseClassificationDialog = () => {
    setOpenClassificationDialog(false);
  };

  const audioOutputResults = [
    "Un 30% de la duración del audiopresenta el evento Motocicleta",
    "Un 80% de la duración del audiopresenta el evento Bla bla",
    "Un 10% de la duración del audiopresenta el evento bocina"
  ];
  const videoOutputResults = [
    { class_name: "Livianos", counter: 10, speed_average: 50 },
    { class_name: "Motocicletas", counter: 15, speed_average: 45 },
    { class_name: "Pesados", counter: 20, speed_average: 55 }
  ];

  return (
    <div>
      <Dialog
        maxWidth='lg'
        fullWidth
        open={openSuccess}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseSuccess}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Métricas FuSA Roads'}</DialogTitle>
        <DialogContent>
          <div className={'MuiTypography-body1 MuiTypography-colorTextSecondary'}>
            {isAudio &&
              <div>
                <AudioReportOutput output={audioOutputResults} />
                <Button onClick={handleOpenClassificationDialog}>Ver detalle clasificación de audio</Button>
              </div>
            }
            {isVideo && <VideoReportOutput output={modelOutput["video_output"]} />}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccess}>Entendido</Button>
        </DialogActions>
      </Dialog>
      <AudioClassificationDialog
        openSuccess={openClassificationDialog}
        handleCloseSuccess={handleCloseClassificationDialog}
        modelOutput={modelOutput}
        modelType={"SED"}
      />
    </div>
  )
}

export default RoadsReportDialog