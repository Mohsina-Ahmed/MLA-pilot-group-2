import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ currentUser }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = 'http://localhost:5050/stats';

    axios.get(url)
      .then(response => {
        const userData = response.data.stats.find(user => user.username === currentUser);
        setData(userData ? userData.exercises : []);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [currentUser]);

  return (
    <div>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <p>Exercise Type: {item.exerciseType}</p>
            <p>Total Duration: {item.totalDuration}</p>
          </div>
        ))
      ) : (
        <p>No data available for {currentUser}</p>
      )}
    </div>
  );
};

export default Statistics;