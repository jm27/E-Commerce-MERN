import React, {useState} from 'react';

const App = () => {
  const [letter, setLetter] = useState('j')

  return(<div>
    Hello Amigos , {letter}
  </div>)
}
export default App;
