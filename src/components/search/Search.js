import React, { useState, useEffect } from 'react'
import Img from '../Img'
import Style from './Search.module.css'
import SearchOptions from './SearchOptions'
import { firestore } from '../../firebase'

export default function Search() {

    const [search, setSearch] = useState("")
    const [oldQuery, setOldQuery] = useState("")
    const [canRequest, setCanRequest] = useState(true)

    const [searchOptions, setSearchOptions] = useState([])
    const handleChange = (e) => {
        if (e.target.name === "search") {
            if(e.target.value.length < search.length)
                setOldQuery(e.target.value.slice(0,e.target.value.length - 3))
            setSearch(e.target.value)
        }
    }

    useEffect(() => {
        if (canRequest && (
            oldQuery.length + 2 < search.length  
            || (oldQuery.length === 0 && search.length > 2))) {
            console.log("searching", search)
            setOldQuery(search)
            setCanRequest(false)
            firestore.collection('products').where('tags', 'array-contains-any',
                search.split(" ").filter(word => {
                    if (word.length >= search.length  || word != "in"
                        || word != "of" || word != "for")
                        return word
                })).limit(6).get().then(docs => {
                    let searchOptionsCopy = []
                    docs.forEach(doc => {
                        doc.data().tags.filter(tag => {
                            if(search < tag)
                                searchOptionsCopy.push(tag)
                        })
                    })
                    console.log("searchOptionsCopy", searchOptionsCopy)
                    setSearchOptions(searchOptionsCopy)
                    setCanRequest(true)
                })
        }
    }, [search, canRequest])
    return (
        <div className={Style.searchWrap}>
            <div className={Style.inputWrap}>
                <input className={Style.input} name="search" type="text" value={search} onChange={handleChange} placeholder="Search" />
                {
                    !search ? null :
                        <SearchOptions searchOptions={searchOptions} />
                }
            </div>
            <img className={Style.img} src={"https://img1.hkrtcdn.com/ff/Whey%20Protein_2%20kg.png"} />
        </div>
    )
}
