import React from 'react'
import style from './ShowTags.module.css'

export default function ShowTags({ tags = [], search }) {
	return (
		<div className="container">
			<div className={["row", style.wrap].join(" ")}>
				{
					search ? <h2>showing result for <b>{search}</b></h2> : null
				}
			</div>
			<div className={["row", style.wrap].join(" ")}>
				{
					tags.map((tag, index) => (
						<span>{tag}</span>
					))
				}
			</div>
		</div>
	)
}