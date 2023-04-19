/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { createStore } from 'redux';

import ReactDOM from 'react-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { rootReducer } from '../../reducers/index';
import { setGroupFilter, addGroup } from '../../actions/index';

const axios = require('axios');

// const store = createStore(rootReducer);

async function getGroups() {
  const url = 'http://localhost:5000/api/groups';
  try {
    const res = await axios.get(url);
    return res.data.data;
  } catch (reason) {
    return reason;
  }
}

function GroupRow(props) {
  // const { g } = props;
  // console.log('in groupRow, g is ', g);
  return (
    <tr>
      {/* <NameCell group={g} /> */}
      <td>{props.group.name}</td>
    </tr>
  );
}

function GroupTable() {
  // extract states from store
  const groupsList = useSelector((state) => state.groups);
  console.log('&&&&&&&&&&&&&&&& filtered group list is', groupsList);
  const groupFilter = useSelector((state) => state.groupFilter);
  console.log('&&&&&&&&&&&&&&&& group filter is', groupFilter);

  const makeRows = () => {
    const rows = [];
    if (!groupFilter || !groupsList) {
      return null;
    }
    groupsList.forEach((element) => {
      const { group } = element;
      if (group.public !== 1 || group.tags === undefined) { // only filter on public groups, skip the ones without tags
        return;
      }
      if (groupFilter === 'SHOW_ALL') {
        rows.push(
          <GroupRow
            group={group}
            key={group.name}
          />,
        );
      } else {
        let include = false;
        Array.from(group.tags, (tag) => {
          if (tag.startsWith(groupFilter)) {
            include = true;
          }
        });
        if (!include) {
          return;
        }
        // if (!group.name.startsWith(groupFilter)) {
        //   return;
        // }
        rows.push(
          <GroupRow
            group={group}
            key={group.name}
          />,
        );
      }
    });
    return rows;
  };
  const rows = makeRows();

  return (
    <div>
      <p>
        Filtered results for
        {' "'}
        {groupFilter}
        &quot;
      </p>
      <table>
        <thead>
          <tr>
            <th>Group Name</th>
            {/* <th>Num Members</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>

  );
}

// function SearchBar() {
//   // const { store } = props;
//   const handleFilterTextChange = (e) => {
//     store.dispatch(setGroupFilter(e.target.value));
//   };

//   return (
//     <form>
//       <input
//         type="text"
//         placeholder="Search..."
//         onChange={handleFilterTextChange}
//       />
//     </form>
//   );
// }

function FilterableGroupsTable(props) {
  const dispatch = useDispatch();
  // const { store } = props;

  useEffect(() => {
    // get data from server, add to state

    async function fetchData() {
      const x = await getGroups();
      x.forEach((element) => {
        dispatch(addGroup({
          name: element.name,
          public: element.public,
          tags: element.tags,
        }));
      });
    }
    fetchData();
    if (props.mystore !== undefined) {
      const unsubscribeStore = props.mystore.subscribe(() => {
        console.log('cleanup', props.mystore.getState().groups.length);
      });
      return unsubscribeStore;
    }
    return null;
  });

  return (
    <div>
      {/* <SearchBar /> */}
      <GroupTable />
    </div>
  );
}

function FilterGroup(props) {
  const { store } = props;
  return (
    <div>
      <FilterableGroupsTable mystore={store} />
    </div>
  );
}

export default FilterGroup;
