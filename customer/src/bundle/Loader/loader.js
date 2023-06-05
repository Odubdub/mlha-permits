import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import lottie from 'lottie-web';
import LogoAnim from './full.json';

var lottieCon;
var anim;

const modes = {
  default: 0,
  start: 1,
  end: 2,
  check: 3,
  error: 4
};

const Loader = ({
  stop,
  start,
  stopWithCheck,
  stopWithError,
  onReady,
  title,
  subtitle,
  error,
  onFinishedLoading
}) => {
  const [mode, setMode] = useState(modes.default);
  var isCheck = useRef(false);
  var isError = useRef(false);
  var stopLoading = useRef(false);

  useEffect(() => {
    anim = lottie.loadAnimation({
      container: lottieCon,
      renderer: 'svg',
      autoplay: false,
      animationData: LogoAnim
    });

    start.current = startLoading;
    stop.current = haltLoading;
    stopWithCheck.current = haltLoadingWithCheck;
    stopWithError.current = haltLoadingWithError;

    // anim.addEventListener('DOMLoaded', animate(anim, mode))
    // return () => {

    //     anim.removeEventListener('DOMLoaded', animate(anim, mode))
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    start.current = startLoading;
    stop.current = haltLoading;
    stopWithCheck.current = haltLoadingWithCheck;
    stopWithError.current = haltLoadingWithError;
    if (onReady) {
      onReady();
    }

    animate(anim, mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const haltLoading = () => {
    stopLoading.current = true;
    isCheck.current = false;
  };

  const haltLoadingWithCheck = () => {
    isCheck.current = true;
    stopLoading.current = true;
  };

  const haltLoadingWithError = () => {
    isError.current = true;
    stopLoading.current = true;
  };

  const startLoading = () => {
    stopLoading.current = false;
    isCheck.current = false;
    isError.current = false;
    setMode(modes.start);
  };

  const nextLoad = () => {
    if (mode === modes.start) {
      haltLoading();
    } else {
      startLoading();
    }
  };

  const animate = (anim, m) => {
    if (m === modes.default) {
      //Transition and Load
      anim.loop = false;
      anim.setDirection(-1);
      anim.playSegments([0, 1], true);
    } else if (m === modes.start) {
      //Transition and Load
      anim.loop = false;
      anim.setDirection(1);
      anim.playSegments([0, 30], true);
      anim.onLoopComplete = () => {
        //Transition to Complete load
        if (stopLoading.current === true) {
          if (isCheck.current === true) {
            setMode(modes.check);
          } else if (isError.current === true) {
            setMode(modes.error);
          } else {
            setMode(modes.end);
          }
        }
      };

      anim.onComplete = () => {
        anim.loop = true;
        anim.playSegments([30, 90], true);
      };
    } else if (m === modes.end) {
      console.log('Playing End');
      anim.loop = false;
      anim.setDirection(1);
      anim.playSegments([90, 120], true);
      anim.onComplete = () => {
        anim.pause();
        setMode(modes.default);

        if (onFinishedLoading) {
          onFinishedLoading();
        }
      };
    } else if (mode === modes.check) {
      anim.loop = false;
      anim.setDirection(1);
      anim.playSegments([120, 150], true);
      anim.onComplete = () => {
        anim.pause();
        if (onFinishedLoading) {
          onFinishedLoading();
        }
      };
    } else if (mode === modes.error) {
      anim.loop = false;
      anim.setDirection(1);
      anim.playSegments([151, 180], true);
      anim.onComplete = () => {
        anim.pause();
        if (onFinishedLoading) {
          onFinishedLoading();
        }
      };
    }
  };

  return (
    <div className="con-loader" style={{ marginTop: 'auto', overflow: 'hidden' }} role="button">
      <div className="logo-con" role="button" ref={(ref) => (lottieCon = ref)} />
      <div>
        <h4>{title}</h4>
        {error === null && <h6 className="subtitle">{subtitle}</h6>}

        {error !== null && <h6 className="error">{error}</h6>}
      </div>
    </div>
  );
};

export default Loader;
