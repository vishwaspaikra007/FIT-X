import React, {useState} from "react";
import { useHistory } from "react-router-dom";

const MobileSearch = (props) => {
  const [search, setSearch] = useState("")
  const history = useHistory()
  const searchProduct = e => {
    e.preventDefault()
    if(search) {
     history.push({pathname: `/products/${search}`})
     props.closeMobileMenu()
    }
  }
  return (
    <div className="offcanvas-mobile-search-area">
      <form onSubmit={e => searchProduct(e)}>
        <input type="text" placeholder="Search ..." value={search} onChange={e => setSearch(e.target.value.toLowerCase())} />
        <button type="submit">
          <i className="fa fa-search" />
        </button>
      </form>
    </div>
  );
};

export default MobileSearch;
