import React, {useRef, useEffect, useState} from 'react'

export default function LoadContent(props) {
    const ref = useRef()


    const onScroll = () => {
        if(ref.current)
        props.onChange(ref.current.getBoundingClientRect().y < document.documentElement.getBoundingClientRect().height ? true : false)
    }

    useEffect(() => {
        if(ref.current) {
            window.addEventListener('scroll', onScroll)
        }
        return () => {
            window.removeEventListener('scroll', onscroll)
        }
    }, [ref.current])

    return (
        <div ref={ref} style={{
            width: "100%",
            height: "100%"
        }}></div>
    )
}
