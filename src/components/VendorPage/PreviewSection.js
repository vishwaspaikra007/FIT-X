import React from 'react'
import Style from './Style.module.css'

export default function PreviewSection(props) {
    const { newContent } = props
    return (
        <div className={Style.sectionPreview} >
            <h1 className={Style.sectionH1} >{newContent.header}</h1>
            <p className={Style.sectionP} >{newContent.paragraph}</p>
        </div>
    )
}
