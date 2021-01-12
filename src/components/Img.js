import React, { useState, useEffect } from 'react'
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import PreLoader from "./PreLoader";

function Img(props) {

    const [loaded, setLoaded] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if(loaded)
            setIsLoaded(true)
    }, [loaded])

    return (
        <div style={{
            position: "relative",
            width: '100%',
            height: props.style && props.style.height ? props.style.height : '100%'
        }}>
                <LazyLoadImage 
                className={[props.className, props.className].join(" ")}
                scrollPosition={props.scrollPosition}
                src={props.src} style={{
                    display: "block",
                    transition: isLoaded && props.style && props.style.transition ? props.style.transition : "none",
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? "scale(1)" : "scale(0.1)",
                    position: loaded ? "relative" : "absolute", 
                    top: 0, left: 0,
                    zIndex: loaded ? 0 : -1,
                    width: loaded ? '' : "100%",
                    objectFit: "cover",
                    ...props.style, 
                    }} afterLoad={() => setLoaded(true)} />
                {/* <div className={["fitX-preloader-wrapper", props.className].join(" ")} 
                    style={{
                        ...props.style, position: "relative", zIndex: 1,
                        display: loaded ? "none": "block",
                        }}>
                    <div className="fitX-preloader">
                        <span></span>
                        <span></span>
                    </div>
                </div>  */}
                <PreLoader className={props.className} style={{
                        ...props.style, position: "relative", zIndex: 1,
                        display: loaded ? "none": "flex",
                        }}></PreLoader>
        </div>
    )
}

export default trackWindowScroll(Img)