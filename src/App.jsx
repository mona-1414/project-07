import React, { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://tuwkmbbxtwkaxcmgpvud.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1d2ttYmJ4dHdrYXhjbWdwdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwNjI3NjksImV4cCI6MjAxNDYzODc2OX0.jd3_h3VRQVWxdTbzQ6AW-k2DE4howKU4JHooA0tY3Ho');

function App() {
  const [crewmates, setCrewmates] = useState([]);
  const [newCrewmate, setNewCrewmate] = useState({
    name: '',
    age: '',
    country: '',
    funFact: '',
  });
  const [editCrewmate, setEditCrewmate] = useState({
    id: null,
    name: '',
    age: '',
    country: '',
    funFact: '',
  });

  useEffect(() => {
    async function fetchCrewmates() {
      const { data, error } = await supabase.from('crewmates').select('*');
      if (error) {
        console.error('Error fetching crewmates:', error);
      } else {
        setCrewmates(data);
      }
    }

    fetchCrewmates();
  }, []);

  const handleInputChange = (e) => {
    setNewCrewmate({ ...newCrewmate, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditCrewmate({ ...editCrewmate, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase.from('crewmates').upsert([newCrewmate]);

    if (error) {
      console.error('Error adding crewmate:', error);
    } else {
      setCrewmates((prevCrewmates) => [...prevCrewmates, data[0]]);
      setNewCrewmate({
        name: '',
        age: '',
        country: '',
        funFact: '',
      });
    }
  };

  const handleDeleteCrewmate = async (crewmateId) => {
    const { error } = await supabase.from('crewmates').delete().eq('id', crewmateId);

    if (error) {
      console.error('Error deleting crewmate:', error);
    } else {
      setCrewmates((prevCrewmates) => prevCrewmates.filter((crewmate) => crewmate.id !== crewmateId));
    }
  };

  const handleEditCrewmate = (crewmate) => {
    setEditCrewmate({
      id: crewmate.id,
      name: crewmate.name,
      age: crewmate.age,
      country: crewmate.country,
      funFact: crewmate.funFact,
    });
  };

  const handleUpdateCrewmate = async () => {
    const { data, error } = await supabase
      .from('crewmates')
      .update(editCrewmate)
      .eq('id', editCrewmate.id);

    if (error) {
      console.error('Error updating crewmate:', error);
    } else {
      const updatedIndex = crewmates.findIndex((c) => c.id === editCrewmate.id);
      const updatedCrewmates = [...crewmates];
      updatedCrewmates[updatedIndex] = data[0];
      setCrewmates(updatedCrewmates);
      setEditCrewmate({
        id: null,
        name: '',
        age: '',
        country: '',
        funFact: '',
      });
    }
  };

  return (
    <div>
      <h1>Crewmate App</h1>
      <div>
        <h2>Add a Crewmate</h2>
        <form>
          <input
            type="text"
            name="name"
            placeholder="Crewmate Name"
            value={newCrewmate.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newCrewmate.age}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={newCrewmate.country}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="funFact"
            placeholder="Fun Fact"
            value={newCrewmate.funFact}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleSubmit}>
            Add Crewmate
          </button>
        </form>
      </div>
      <div>
        <h2>My Crewmates</h2>
        <ul>
          {crewmates.map((crewmate) => (
            <li key={crewmate.id}>
              {crewmate.name} - Age: {crewmate.age}, Country: {crewmate.country}, Fun Fact: {crewmate.funFact}
              <button onClick={() => handleEditCrewmate(crewmate)}>Edit</button>
              <button onClick={() => handleDeleteCrewmate(crewmate.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {editCrewmate.id && (
        <div>
          <h2>Edit Crewmate</h2>
          <form>
            <input
              type="text"
              name="name"
              placeholder="Crewmate Name"
              value={editCrewmate.name}
              onChange={handleEditInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={editCrewmate.age}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={editCrewmate.country}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="funFact"
              placeholder="Fun Fact"
              value={editCrewmate.funFact}
              onChange={handleEditInputChange}
            />
            <button type="button" onClick={handleUpdateCrewmate}>
              Update Crewmate
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
