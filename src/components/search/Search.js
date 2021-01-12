import React, { useState, useEffect } from 'react'
import Img from '../Img'
import Style from './Search.module.css'
import SearchOptions from './SearchOptions'
import { firestore } from '../../firebase'
import { useHistory } from 'react-router-dom'

export default function Search() {

    const [search, setSearch] = useState("")
    const [oldQuery, setOldQuery] = useState("")
    const [canRequest, setCanRequest] = useState(true)
    const history = useHistory()

    const showSearch = e => {
        e.preventDefault()
        if (search)
            history.push({ pathname: `/products/${search}` })
    }
    return (
        <div className={Style.searchWrap}>
            <div className={Style.inputWrap}>
                <form onSubmit={e => showSearch(e)}>
                    <input className={Style.input} name="search" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" />
                    {/* {
                    !search ? null :
                        <SearchOptions searchOptions={searchOptions} />
                } */}
                </form>
            </div>
            <img className={Style.img} src={"https://img1.hkrtcdn.com/ff/Whey%20Protein_2%20kg.png"} />
        </div>
    )
}
