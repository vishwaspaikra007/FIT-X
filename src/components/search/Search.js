import React, {useState} from 'react'
import Img from '../Img'
import Style from './Search.module.css'

export default function Search() {

    const [search, setSearch] = useState("")
    const handleChange = (e) => {
        if(e.target.name === "search")
        {
            setSearch(e.target.value)
        }
    }
    return (
        <div className={Style.searchWrap}>
            <input className={Style.input} name="search" type="text" value={search} onChange={handleChange}  placeholder="Search"/>
            <img className={Style.img} src={"https://img1.hkrtcdn.com/ff/Whey%20Protein_2%20kg.png"} />
        </div>
    )
}
