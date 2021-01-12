import React from 'react'
import Style from './Style.module.css'

export default function PreviewImage(props) {
    const { newContent } = props
    return (
        <>
            <div className={Style.imagePreview} >
                <img className={Style.previewImage} src={newContent.imgURL} />
            </div>
        </>
    )
}
