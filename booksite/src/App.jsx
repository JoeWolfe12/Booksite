import { useState } from 'react'
import SearchBooks from "./features/searchBooks/searchBooks";
import './App.css'


function App() {
  return (
    <div className="App">
      <h1>Joe’s Booksite</h1>
      <SearchBooks />
    </div>
  );
}

export default App
