import { React, useState } from 'react';
import groupLib from './groupAPI';

function SortGroups() {
  const [data, setData] = useState();
  const [attrib, setAttrib] = useState('newpost'); // default is newpost
  const [order, setOrder] = useState(1); // default is asc
  const [finalAttrib, setFinalAttrib] = useState(); // to prevent display change when changing attrib option
  const dateFormatOptions = {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  };

  const handleAttribChange = (e) => {
    setAttrib(e.target.value);
  };
  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(`sort on ${attrib} in ${order} order`);

    if (!attrib || !order) {
      alert('Must choose an attribute and order to sort on!');
    }
    await groupLib.sortGroups(attrib, order).then((res) => {
      console.log('sorted groups res is', res);
      setData(res);
      setFinalAttrib(attrib);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div>
      <select onChange={(e) => handleAttribChange(e)}>
        <option value="newpost">New Post</option>
        <option value="nummembers">Members</option>
        <option value="numposts">Posts</option>
      </select>
      <select onChange={(e) => handleOrderChange(e)}>
        <option value="1">From least to most</option>
        <option value="-1">From most to least</option>
      </select>
      <button type="button" onClick={handleSubmit}>Sort</button>

      {data ? (
        <div className="displayGroups">
          {data.map((group) => (
            <div key={group._id} style={{ margin: '30px' }}>
              <div>{`Group Name: ${group.groupname}`}</div>
              {finalAttrib === 'nummembers' ? (
                <div>{`Number of Members: ${group.countMembers}`}</div>
              ) : null }
              {finalAttrib === 'numposts' ? (
                <div>{`Number of Posts: ${group.countPosts}`}</div>
              ) : null }
              {finalAttrib === 'newpost' ? (
                <div>{`Newest Post At: ${new Date(group.newestPost).toLocaleDateString('en-US', dateFormatOptions)}`}</div>
              ) : null }
            </div>
          ))}
        </div>
      ) : null}

    </div>
  );
}

export default SortGroups;
