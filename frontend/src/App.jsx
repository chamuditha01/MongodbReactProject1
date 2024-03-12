import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [persons, setPersons] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('image', image);

      // Send a POST request to the backend API
      await axios.post('http://localhost:5000/insertPerson', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Person inserted successfully');
      setName('');
      setAge('');
      setImage(null);
    } catch (error) {
      console.error('Error inserting person:', error);
      setMessage('Failed to insert person');
    }
  };

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getPersons');
        setPersons(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Add Person</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        <br />
        <label>Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <br />
        <button type="submit">Add Person</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Person List</h2>
      <ul>
        {persons.map(person => (
          <li key={person._id}>
            <p>Name: {person.name}</p>
            <p>Age: {person.age}</p>
            <img src={`data:image/jpeg;base64,${person.image}`} alt={person.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
