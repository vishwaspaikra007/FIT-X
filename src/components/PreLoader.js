import React from 'react'

export default function PreLoader(props) {
    return (
        <div className="flone-preloader-wrapper" style={props.style}>
            <div className="flone-preloader">
                <span></span>
                <span></span>
            </div>
        </div>
    )
}
