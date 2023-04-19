import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setGroupFilter } from '../actions/index';
import Search from './search.svg';
import './Home.css';

function SearchBar(props) {
  // const { store } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [showPopUp, setShowPopUp] = useState(false);

  const [searchText, setSearchText] = useState('');
  const handleGroupFilterTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const search = document.getElementById('searchImage');
  if (search) {
    search.onclick = () => {
      console.log(`in submitFilter, dispatch filter with text [${searchText}]`);
      // store.dispatch(setGroupFilter(e.target.value));
      dispatch(setGroupFilter(searchText));
      // setShowPopUp(true);
      const text = document.getElementById('text');
      text.value = '';
      navigate('/filtergroup');// go to filter group by tag page
      return false; // Prevent page refresh
    };
  }

  return (
    <div>
      <input className="Search" id="text" placeholder="Filter Groups..." onChange={handleGroupFilterTextChange} />
      <img src={Search} id="searchImage" className="SearchIconImg" alt="" />
    </div>
  );
}

export default SearchBar;
