import { LoadingButton } from '@mui/lab'
import { CardHeader, Card, Modal, Stack, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import SignaturePad from 'signature_pad'
import Iconify from 'src/components/Iconify'

function SignatureModal({open, onClose, onSave}) {

    const divRef = useRef()
    const signaturePad = useRef(null)
    const [signatureEmpty, setSignatureEmpty] = useState(false)
    let signatureRedoArray = []

    const handleSave = () => {

        if (!signaturePad.current.isEmpty()){
            onSave(signaturePad.current.toDataURL())
        } else {
            setSignatureEmpty(true)
        }
    }

    const handleUndo = () => {
        let signatureRemovedData = []
        let signatureData = signaturePad.current.toData()
        let signatureRedoData = _.cloneDeep(signatureData)
        let signatureRedoArray = []

        if (signatureData.length > 0) {
            signatureData.pop()
            signaturePad.current.fromData(signatureData)
            signatureRemovedData = signatureRedoData[signatureRedoData.length - 1]
            signatureRedoArray.push(signatureRemovedData)
        }
    }
    
      const handleRedo = () => {
        if (signatureRedoArray.length !== 0) {
          let values = signaturePad.current.toData()
          let lastValue = signatureRedoArray[signatureRedoArray.length - 1]
          values.push(lastValue)
          signaturePad.current.fromData(values)
          signatureRedoArray.pop(lastValue)
        }
      }

      const setup = () => {

        if (signaturePad.current == null) {

            const element = document.getElementById('signature-pad')

            if (element != null){
                let canvas = element.querySelector("canvas")
                canvas.getContext("2d").scale(1, 1)
                signaturePad.current = new SignaturePad(canvas)
            }
        }
      }
    
      const handleClear = () => {
        signaturePad.current.clear()
      }

    useEffect(() => {

        const interval = setInterval(() => {
            setup()
        }, 500)
        
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {

        if (!open){
            signaturePad.current = null
        }
    },[open])
    
return (
        <Modal open={open}>
            <Stack alignItems='center' justifyContent='center' width='100vw' height='100vh'>
                <Card sx={{ width: 500, height: 550}}>
                    <CardHeader
                        title='Admin Signature' sx={{mb:1}} 
                        subheader={'Required for a role assigned to this user'}
                        action={
                            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                <IconButton onClick={handleClear}>
                                    <Iconify icon='ph:eraser-fill'/>
                                </IconButton>
                                <IconButton onClick={handleUndo}>
                                    <Iconify icon='jam:undo'/>
                                </IconButton>
                                {/* <IconButton>
                                    <Iconify icon='jam:redo' onClick={handleRedo}/>
                                </IconButton> */}
                                <IconButton onClick={()=>onClose()}>
                                    <Iconify icon='gg:close'/>
                                </IconButton>
                            </Stack>
                        }/>
                    <Stack alignItems='center' justifyContent='center' height={390}>
                        <div ref={divRef} onClick={()=>setup()} id='signature-pad' style={{ overflow: 'hidden', borderRadius: '10px', border: `1px ${signatureEmpty?'solid red':"dashed grey"}`, backgroundColor:'white'}}>
                            <canvas>
                            </canvas>
                        </div>
                    </Stack>
                    <Stack alignItems='end' pr={4} pb={2} sx={{justifySelf:'end'}} justifyContent='center' width='100%' height={50}>
                        <LoadingButton variant='contained' endIcon={<Iconify icon='akar-icons:arrow-right'/>} onClick={handleSave}>Save</LoadingButton>
                    </Stack>
                </Card>
            </Stack>
        </Modal>
    )
}

export default SignatureModal