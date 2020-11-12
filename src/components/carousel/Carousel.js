import React, {useRef, useEffect, useState} from 'react'
import carouselStyle from './Carousel.module.css'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Button from '@material-ui/core/Button';
import './Carousel.css'

export default function Carousel(props) {

    const childWrapRef = useRef()
    const parentWrapRef = useRef()
    const toNegative = useRef(false)
    const intervalRef = useRef()

    console.log(props.showN)
    const [showNavigationButton, setShowNavigationButton] 
        = useState(() => props.showNavigationButton != undefined ? props.showNavigationButton : true)

    const [sizeOfEachChild, setSizeOfEachChild] 
        = useState(props.minWidthOfChild != undefined ? props.minWidthOfChild : 250)

    const [childWidth, setChildWidth] = useState()

    const [allowAutoScroll, setallowAutoScroll] 
        = useState(props.allowAutoScroll != undefined ? props.allowAutoScroll : true)

    const [showScrollbar, setShowScrollbar] = useState(props.showScrollbar != undefined ? props.showScrollbar : true)

    const [scrollbarColor, setScrollbarColor] = useState(props.scrollbarColor != undefined ? props.scrollbarColor : "orange")

    const btnStyle = {
        height: "100%",
        minWidth: "10px",
        padding: 0,
    }

    const onResize = ()=> {
        if(parentWrapRef.current)
        {
        setChildWidth(
            sizeOfEachChild
            + (
                (parentWrapRef.current.clientWidth%sizeOfEachChild)
                / Math.floor(parentWrapRef.current.clientWidth/sizeOfEachChild).toFixed()
            )
        )


        if(parentWrapRef.current.clientWidth == parentWrapRef.current.scrollWidth )
            setShowNavigationButton(false)
        else
            setShowNavigationButton(true)
        }
    }

    useEffect(() => {
        if(scrollbarColor)
        {
            parentWrapRef.current.style.setProperty("--main-scrollbar-color", scrollbarColor)
        }

        if(parentWrapRef.current.clientWidth == parentWrapRef.current.scrollWidth )
            setShowNavigationButton(false)
        else
            setShowNavigationButton(true)

        if(!childWidth && parentWrapRef.current) {
            setChildWidth(
                sizeOfEachChild
                + (
                    (parentWrapRef.current.clientWidth%sizeOfEachChild)
                    / Math.floor(parentWrapRef.current.clientWidth/sizeOfEachChild)
                )
            )
            window.addEventListener("resize", () => onResize())
        }
        return () => {
            window.removeEventListener("resize", onResize)
        }
    },[parentWrapRef.current])


    useEffect(() => {
        if(allowAutoScroll && !intervalRef.current)
        {
            intervalRef.current = setInterval(() => {
                const offset = parentWrapRef.current.clientWidth
                const scrollLeft = parentWrapRef.current.scrollLeft
                const scrollWidth = parentWrapRef.current.scrollWidth
                if(scrollLeft + offset >= scrollWidth)
                    toNegative.current = true

                if(scrollLeft  <= 0)
                    toNegative.current =false

                parentWrapRef.current.scrollBy(toNegative.current ? -offset : offset, 0)
                
            }, props.autoScrollinterval | 3000);
        }
        return ()=> {
            clearInterval(intervalRef.current)
        }
    }, [allowAutoScroll])

    const handleChange = (type) => {
        
        const scrollBy = parentWrapRef.current.clientWidth

        switch(type) {
            case 'back':
                parentWrapRef.current.scrollBy(-scrollBy,0)
                break

            case 'next':
                parentWrapRef.current.scrollBy(scrollBy,0)
                break
        }
    }

    return (
        <div className={[carouselStyle.customCarousel, "customCarouselScrollBar"].join(" ")}
        >
            <div className={carouselStyle.backIcon}
                style={{
                    visibility: showNavigationButton ? "visible" : "hidden"
                }}
                onClick={e => handleChange('back')}    
            >
                <Button style={btnStyle}>
                    <NavigateBeforeIcon className={carouselStyle.navigationIcon}/>
                </Button>
            </div>
        <div 
            className={
                [
                    carouselStyle.parentWrapper, 
                    showScrollbar == "auto" ? "" : 
                        showScrollbar == true ? carouselStyle.parentWrapperScrollbar
                         :  carouselStyle.noScrollbar
                ].join(" ")}            
            ref={parentWrapRef}
           >
            
            <div ref={childWrapRef} 
            className={carouselStyle.childWrap}
            >
            {
                childWidth ?
                props.children.map((ele, index) => (
                    <div 
                        key={index}
                        className={carouselStyle.child}
                        style={{
                            width: 
                                childWidth
                                + "px"
                        }}
                    >
                        {ele}
                    </div>
                )) : null
            }
            </div>
        </div>
        <div className={carouselStyle.nextIcon}
            style={{
                visibility: showNavigationButton ? "visible" : "hidden"
            }}
            onClick={e => handleChange('next')}
        >
            <Button style={btnStyle}>
            <NavigateNextIcon />
            </Button>
        </div>
        </div>

    )
}