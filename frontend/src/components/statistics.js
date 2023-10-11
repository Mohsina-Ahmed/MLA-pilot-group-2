import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = 'http://localhost:5050/stats';

    axios.get(url)
      .then(response => {
        setData(response.data.stats);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <p>Exercise Type: {item._id}</p>
            <p>Total Duration: {item.duration}</p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Statistics;
