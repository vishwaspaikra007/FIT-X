import React from 'react'
import animationData from './3098-loader.json'
import Lottie from 'react-lottie';

export default function PreLoader(props) {
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };
    return (
        // <div className="fitX-preloader-wrapper" style={props.style}>
        //     <div className="fitX-preloader">
        //         <span></span>
        //         <span></span>
        //     </div>
        // </div>
        // <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_PBgNop.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;"  loop controls autoplay></lottie-player>
        <div className={["fitX-preloader-wrapper", props.className].join(" ")} style={props.style}>
            <div>
            <Lottie options={defaultOptions}
              isPaused={false}
              isStopped={false}
            />
            </div>
        </div>
    )
}
