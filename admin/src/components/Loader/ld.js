import React, { useEffect, useRef, useState } from 'react';
import './style.css'
import lottie from 'lottie-web';
import LogoAnim from './full.json'

var lottieCon
var anim

const modes = {
    default: 0,
    start: 1,
    end: 2,
    check: 3
}

const Loader = ({isLogin, shouldLoad, title, subtitle, error, isCheck, onFinishedLoading}) => {

    var mode = useRef(modes.default)

    var stopLoading = useRef(false)

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return (() => {
            mounted.current = false
            lottie.stop()
        });
    });
  
    useEffect(()=> {

        anim = lottie.loadAnimation({

            container: lottieCon,
            renderer: 'svg',
            autoplay: false,
            animationData: LogoAnim
    })

    // anim.addEventListener('loopComplete', ()=>{

    //     console.log('Some done')
    // })

        anim.addEventListener('DOMLoaded', animate(anim, mode.current))
        return () => {

            anim.removeEventListener('DOMLoaded', animate(anim, mode.current))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        console.log('Start it')
        animate(anim, mode.current) 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mode.current])

    useEffect(() => {

        if (shouldLoad === true){
            mode.current = modes.start
            console.log('Just start')
        } else if (shouldLoad === false){
            console.log('Just stop')
            stopLoading.current = true;
        }
    },[shouldLoad])

    const animate = (anim, m) => {
    
        if (m === modes.default){
            //Transition and Load 
            anim.loop = false
            anim.setDirection(-1) 
            anim.playSegments([0,1], true)
        } else if (m === modes.start){
            //Transition and Load 
            anim.loop = false
            anim.setDirection(1) 
            anim.playSegments([0, 30], true)
            anim.onLoopComplete = () => {
                
                //Transition to Complete load
                if (stopLoading.current === true){

                    if (isCheck === true){

                        mode.current = modes.check

                        console.log('Transition to check')
                        // if (mounted){
                        //     setMode(modes.check)
                        // } else {
                        //     console.log('Cant stop')
                        // }
                    } else {

                        console.log('Transition to stop')

                        mode.current = modes.end

                        // if (mounted){
                        //     setMode(modes.end)
                        // }
                    }
                } else {

                    console.log('I wont stop')
                }
            }
            anim.onComplete = () => {

                anim.loop = true
                anim.playSegments([30,90], true)
            }
    
            //Transition Preload
        } else if (m === modes.end){

            console.log('Playing End')
            anim.loop = false
            anim.setDirection(1) 
            anim.playSegments([90, 120], true)
            anim.onComplete = () => {

                anim.pause()
                if (mounted){
                    mode.current = modes.default
                }
                if (onFinishedLoading){
                    onFinishedLoading()
                }
            }
        } else if (mode.current === modes.check){

            anim.loop = false
            anim.setDirection(1) 
            anim.playSegments([120, 150], true)
            anim.onComplete = () => {

                anim.pause()
                if (onFinishedLoading){
                    onFinishedLoading()
                }
            }
        }
    }

    const nextLoad = () =>{

        if (mode.current === modes.start){
            stopLoading.current = true
            console.log('Stop it')
        } else {
            console.log('Start it')
            mode.current = modes.start
            // setMode(prevMode =>{
            
            //     if (prevMode === modes.default){
            //         console.log('Loading start')
            //         return modes.start
            //     } else if (prevMode === modes.end){
            //         console.log('Loading default')
            //         return modes.default
            //     }
            // })
        }
    }

    return (
        <div className='con-loader'>
            <div className='logo-con' ref={ref => lottieCon = ref}/>
            <div className='text' onClick={()=>nextLoad()}>
                <h4>
                    {title}
                </h4>
                {error === null && <h6 className='subtitle'>
                    {subtitle}
                </h6>}
            
            { error !== null && <h6 className='error'>{error}</h6>}
            </div>
        </div>
    );
};

// export default Loader;