import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import ClickableChart from './components/ClickableChart';
import { toRomaji } from 'wanakana';

const App = () => {
  const [characterInput, setCharacterInput] = useState('');
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const resultsRef = useRef(null);

  // Load characters from the static JSON file
  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        const response = await fetch('/characters.json');
        const data = await response.json();
        const dataWithRomaji = data.map((character) => ({
          ...character,
          romaji: character.jap_name ? toRomaji(character.jap_name) : 'N/A',
        }));
        setCharacters(dataWithRomaji);
        console.log("All characters fetched:", dataWithRomaji);  // Debugging line
      } catch (error) {
        console.error('Error fetching all characters:', error);
      }
    };
    fetchAllCharacters();
  }, []);

  const searchCharacters = useCallback((character) => {
    console.log("Searching for characters:", character);  // Debugging line
    const filtered = characters.filter(c =>
      c.name.includes(character) ||
      (c.jap_name && c.jap_name.includes(character)) ||
      (c.rom_name && c.rom_name.includes(character))
    );
    setFilteredCharacters(filtered);
    console.log("Filtered characters:", filtered);  // Debugging line
  }, [characters]);

  const handleCharacterSelect = (character) => {
    console.log("Character selected:", character);  // Debugging line
    setCharacterInput(character);
    setSelectedCharacter(character);
  };

  useEffect(() => {
    if (selectedCharacter) {
      searchCharacters(selectedCharacter);
    }
  }, [selectedCharacter, searchCharacters]);

  useEffect(() => {
    if (filteredCharacters.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Adjust the delay as needed
    }
  }, [filteredCharacters]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    searchCharacters(characterInput);
  };

  return (
    <div className="app-container">
      <h1>Character Learner</h1>
      <form onSubmit={handleFormSubmit} className="search-form">
        <label htmlFor="character">Select or Enter Character(s)/Romaji</label>
        <input
          type="text"
          id="character"
          value={characterInput}
          onChange={(e) => setCharacterInput(e.target.value)}
          required
        />
        <button type="submit">Search Character</button>
      </form>
      <ClickableChart onCharacterSelect={handleCharacterSelect} />
      <div ref={resultsRef} id="results">
        {filteredCharacters.length > 0 && <h2>{selectedCharacter ? `${selectedCharacter} Matching Characters (pun unintended)` : 'All Characters'}</h2>}
        {filteredCharacters.map(character => (
          <div key={character.id}>
            <h2>{character.name}</h2>
            <p>Japanese Name: {character.jap_name}</p>
            <p>Romaji Name: {character.romaji}</p>
            <img src={character.img_url} alt={character.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
