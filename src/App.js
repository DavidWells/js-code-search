import { useState } from 'react'
import './App.css';

function App() {
  const [ word, setWord ] = useState('')
  const cleanWord = formatWord(word)
  const codeSandbox = `https://codesandbox.io/search?refinementList%5Btemplate%5D=&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${word}&refinementList%5Btags%5D=&page=1&configure%5BhitsPerPage%5D=12`
  const githubPkg = `https://github.com/search?o=desc&q=filename%3Apackage.json+${cleanWord}&s=indexed&type=Code`
  const githubJScode = `https://github.com/search${formatRequire(word)}`
  const githubJSImport = `https://github.com/search${formatImport(cleanWord)}`

  const sourceGraphRequire = `https://sourcegraph.com/search?q=require%5C%28%28%27%7C"%29${word}%28%27%7C"%29%5C%29+%28lang:javascript+OR+lang:typescript%29&patternType=regexp`
  const sourceGraphImport = `https://sourcegraph.com/search?q=%28import.*%28%27%7C"%29${word}%28%27%7C"%29%29%28lang:javascript+OR+lang:typescript%29&patternType=regexp`
  return (
    <div className="App">
      <h1>JS Code Search</h1>
      <p>Search for usage examples of any npm package!</p>
      <input 
        onChange={(e) => setWord(e.target.value)}
        value={word}
      />
      <p>Searching for <strong>{word}</strong></p>
      <p>
        <a href={codeSandbox} target='_blank' rel="noopener">
          Code sandbox examples of {word}
        </a>
      </p>
   
      <p>
        <a href={githubPkg} target='_blank' rel="noopener">
          Github projects package.json using {word}
        </a>
      </p>
      <p>
        <a href={githubJSImport} target='_blank' rel="noopener">
           Github projects via <strong>import {word}</strong>
        </a>
      </p>
      <p>
        <a href={githubJScode} target='_blank' rel="noopener">
           Github projects via <strong>require("{word}") </strong>
        </a>
      </p>
      <p>
        <a href={sourceGraphRequire} target='_blank' rel="noopener">
          SourceGraph <strong>require("{word}") </strong>
        </a>
      </p>
      <p>
        <a href={sourceGraphImport} target='_blank' rel="noopener">
          SourceGraph <strong>import {word}</strong>
        </a>
      </p>
    </div>
  )
}

function formatWord(word) {
  // Github doesnt search for anything prefixed with @ for some reason
  if (word.startsWith('@')) {
    const newWord = word.split('/')[1]
    return newWord
  }
  return word
}

function formatRequire(word) {
  // Github doesnt search for anything prefixed with @ for some reason
  if (word.startsWith('@')) {
    const newWord = word.split('/')[1]
    return `?l=JavaScript&o=desc&s=indexed&q=require+${newWord}+language%3AJavaScript+language%3ATypeScript&type=Code`
  }
  return `?l=JavaScript&o=desc&s=indexed&q=require+${word}+language%3AJavaScript+language%3ATypeScript&type=Code`
}

function formatImport(word) {
  // from word
  return `?l=JavaScript&o=desc&s=indexed&q=from%20"${word}"+language%3AJavaScript+language%3ATypeScript&type=Code`
}

export default App;
