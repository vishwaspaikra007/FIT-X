import React, { useState, useEffect } from 'react'
import style from './FilterProduct.module.css'

export default function FilterProduct({ onChange, onSort }) {
    const [state, setState] = useState()

    const filterBox = e => {

    }

    return (
        <div className="container">
            <div className="row">
                <div className={style.filterMobWrap}>
                    <select onChange={onSort}>
                        <option value="popularity">popularity</option>
                        <option value="price low to high">price low to high</option>
                        <option value="price high to low">price high to low</option>
                        <option value="percentage discount">percentage discount</option>
                        <option value="alphabetically">alphabetically</option>
                    </select>
                    {/* <button onClick={e => filterBox(e)}>Filter</button> */}
                </div>
            </div>
        </div>

    )
}
