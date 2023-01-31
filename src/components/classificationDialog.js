import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Button
} from '@material-ui/core'
import { forwardRef } from 'react'
import { fusa_taxonomy } from '@data/fusa_taxonomy'
import dynamic from 'next/dynamic'
const ClassificationPlot = dynamic(() => import("@components/classificationPlot"),  { ssr: false })

const Transition = forwardRef(function Transition (props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const ClassificationDialog = ({
  openSuccess,
  handleCloseSuccess,
  modelOutput
}) => {
  return (
    <Dialog
      maxWidth='lg'
      fullWidth
      open={openSuccess}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseSuccess}
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle>{'Clasificación del modelo'}</DialogTitle>
      <DialogContent>
        <div className={'MuiTypography-body1 MuiTypography-colorTextSecondary'}>
          <p>
            FuSA ha identificado las siguientes fuentes sonoras:
          </p>
          <ClassificationPlot modelOutput={modelOutput}/>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseSuccess}>Entendido</Button>
      </DialogActions>
    </Dialog>
  )
}
export default ClassificationDialog
