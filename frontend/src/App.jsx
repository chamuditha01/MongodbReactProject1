import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      await axios.post('http://localhost:5001/PP', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Person inserted successfully');
      setName('');
      setAge('');
      setImage(null);

      // Fetch updated data after adding a new person
      fetchData();
    } catch (error) {
      console.error('Error inserting person:', error);
      setMessage('Failed to insert person');
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/getPersons');
      setPersons(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

const handleStatusChange = async (personId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'selected' ? 'unselected' : 'selected';
    await axios.put(`http://localhost:5001/updateStatus/${personId}/${newStatus}`);

    // Update the local state after successful update in the database
    setPersons(prevPersons =>
      prevPersons.map(person =>
        person._id === personId ? { ...person, status: newStatus } : person
      )
    );
  } catch (error) {
    console.error('Error updating status:', error.response.data);
  }
};

  
  useEffect(() => {
    // Fetch data from the backend API when the component mounts
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
            <button onClick={() => handleStatusChange(person._id, person.status)}>
              {person.status} : Tap to change
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
