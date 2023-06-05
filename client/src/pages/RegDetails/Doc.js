import { Box, Fade, Grow, IconButton, Modal, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Page } from 'react-pdf';
import { Document } from 'react-pdf/dist/esm/entry.webpack';
import Iconify from 'src/components/Iconify';
import Loader from 'src/components/Loader/loader';

const Doc = ({url, open=false, onClose}) => {

  const stop = useRef()
  const start = useRef()
  const stopWithCheck = useRef()
  const loading = useRef(false)
  const stopWithError = useRef()
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setTimeout(()=>{  
        setNumPages(numPages)

    }, 3000)
  }

  const prev = () => {
    const prevPage = pageNumber - 1
    setPageNumber(prevPage < 1 ? numPages : prevPage)
  }

  const next = () => {
    const nextPage = pageNumber + 1
    setPageNumber(nextPage > numPages ? 1 : nextPage)
  }

  const setError = () => {

    stopWithError.current()
  }

  const close = () => {
    onClose()
    setNumPages(null)
  }

  return (
     <Modal key={open} open={open}>
        <Stack 
            alignItems='center' 
            justifyContent='center' 
            sx={{width:'100vw', height: '100vh'}}>
            <Fade in={numPages == null}>
                <Stack 
                    alignItems='center' 
                    justifyContent='center' 
                    sx={{
                        bgcolor: '#fff', 
                        pb: 3,
                        width: 200,
                        position:'fixed',
                        margin:'auto',
                        zIndex: 100,
                        height: 150,
                        borderRadius: 1}} >
                    <Stack
                        direction='row' 
                        alignItems='center' 
                        justifyContent='space-between' 
                        sx={{
                            py:1,
                            px:1,
                            borderRadius:1,
                            pb: 2}}>
                        <Typography sx={{fontSize: 12}}>
                        Opening Document...
                        </Typography>
                        <IconButton onClick={()=>close()} sx={{ width: 30, height: 30,}}>
                            <Iconify icon='ep:close' />
                        </IconButton>
                    </Stack>
                    {
                        open &&
                        <Box sx={{transform: 'scale(1.5)'}}>
                            <Loader start={start} stop={stop} onReady={()=>start.current()} stopWithCheck={stopWithCheck} stopWithError={stopWithError} />
                        </Box>
                    }
                </Stack>
            </Fade>
            <Stack sx={{height: '100vh'}} alignItems='center' justifyContent='center'>
                <Box>
                    <Document
                        key={open}
                        
                        file={url}
                        onLoadError={setError}
                        onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                        <Stack
                            direction='row'
                            justifyContent='center'
                            sx={{ width:'100%', zIndex:100, top:10, right: 0, left: 0, position:'fixed'}}>
                            <Stack
                                direction='row'
                                alignItems='center' 
                                justifyContent='center' 
                                sx={{
                                    py:1,
                                    backdropFilter: "blur(8px)",
                                    backgroundColor:'rgba(256,256,256,0.1)',
                                    boxShadow: 24,
                                    px:2,
                                    borderRadius:1,
                                    bottom: 2,
                                    zIndex:100,
                                    bgcolor:'#ffffff80'}}>
                                <IconButton disabled={pageNumber==1} onClick={()=>prev()} sx={{ width: 30, height: 30,}}>
                                    <Iconify icon='akar-icons:arrow-left' />
                                </IconButton>
                                <Typography sx={{fontSize: 12}}>
                                Page {pageNumber} of {numPages||'X'}
                                </Typography>
                                <IconButton disabled={pageNumber == numPages} onClick={()=>next()} sx={{ width: 30, height: 30,}}>
                                    <Iconify icon='akar-icons:arrow-right' />
                                </IconButton>
                                <IconButton onClick={()=>close()} sx={{ width: 30, height: 30,}}>
                                    <Iconify icon='ep:close' />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Document>       
                </Box>
            </Stack>         
        </Stack>
    </Modal>
  )
}

export default Doc