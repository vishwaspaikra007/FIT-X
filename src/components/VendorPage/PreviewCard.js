import React from 'react'
import Style from './Style.module.css'

export default function PreviewCard(props) {
    const { newContent} = props
    return (
        <>
            <div className={Style.cardPreview}>
                <img src={newContent.imgURL} />
                <h3>{newContent.header}</h3>
                <p>{newContent.paragraph}</p>
            </div>
        </>
    )
}
