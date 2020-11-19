import React from 'react'

export default function PreLoader(props) {
    return (
        <div className="fitX-preloader-wrapper" style={props.style}>
            <div className="fitX-preloader">
                <span></span>
                <span></span>
            </div>
        </div>
    )
}
