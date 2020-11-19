import React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import Class from './SearchOptions.module.css'

export default function SearchOptions(props) {
    return (
        <List dense={true} className={Class.wrap}>
            {props.searchOptions && props.searchOptions.map((option, id) => (
                <Link to={"/products/" + option} key={id}>
                    <ListItem>
                        <ListItemText
                            primary={option}
                            secondary={null}
                        />
                    </ListItem>
                </Link>
            ))}
            <Link to={{pathname: "/products", state: props.searchOptions}}>
                <ListItem>
                    <ListItemText
                        primary={"See all ..."}
                        secondary={null}
                    />
                </ListItem>
            </Link>
        </List>
    )
}
