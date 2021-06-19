import './App.css';
import {useState, useEffect, useRef} from "react";
import axios from "axios";

function App() {

  const [userValue, setUserValue] = useState('');
  const [suggestionPart, setSuggestionPart] = useState('');
  const inputRef = useRef();
  const userValueRef = useRef();
  userValueRef.current = userValue;

  function handleUserInputChange(e) {
    const newUserValue = e.target.value;

    const diff = newUserValue.substr(userValue.length);

    if (suggestionPart.indexOf(diff) === 0) {
      setSuggestionPart(suggestionPart.substr(diff.length));
    } else {
      setSuggestionPart('');
    }

    setUserValue(newUserValue);
  }

  function findSuggestionFor(phrase) {
    return new Promise((resolve, reject) => {
      axios.get('http://universities.hipolabs.com/search?name='+phrase)
        .then(result => {
          const found = result.data.find(university => university.name.indexOf(phrase) === 0);
          if (found) {
            resolve(found.name);
          } else {
            reject();
          }
        })
    });

  }

  useEffect(() => {
    if (userValue.length > 0) {
      findSuggestionFor(userValue)
        .then(universityName => {
          const stillFits = universityName.indexOf(userValueRef.current) === 0;
          if (stillFits) {
            setSuggestionPart(universityName.substr(userValueRef.current.length));
          } else {
            setSuggestionPart('');
          }
        })
        .catch(() => {
          setSuggestionPart('');
        });
    } else {
      setSuggestionPart('');
    }

  }, [userValue]);

  useEffect(() => {
    console.log(userValueRef.current);
    inputRef.current.selectionStart = userValueRef.current.length;
    inputRef.current.selectionEnd = userValueRef.current.length + suggestionPart.length;
  }, [suggestionPart]);

  return (
    <input type="text" style={{width:'250px'}}
           ref={inputRef}
           onChange={e => handleUserInputChange(e)}
           value={userValue+suggestionPart} placeholder="Search university.." />
  );
}

export default App;
