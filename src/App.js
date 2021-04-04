import { useState, useRef, useEffect } from 'react'
import './App.css';

const initial = getQueryParams('pkg', window.location.href)
const exclude = window.localStorage.getItem('excludeUser') || ''

function App() {
  const inputRef = useRef()
  const [ githubUser, setGithubUser ] = useState(exclude)
  const [ word, setWord ] = useState(initial)

  const excludeSpecificUser = (githubUser) ? `+-user%3A${githubUser}` : ''

  useEffect(() => {
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 500)
    }
  }, [])

  const cleanWord = formatWord(word)
  const codeSandbox = `https://codesandbox.io/search?refinementList%5Btemplate%5D=&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${word}&refinementList%5Btags%5D=&page=1&configure%5BhitsPerPage%5D=12`
  const githubPkg = `https://github.com/search?o=desc&q=filename%3Apackage.json+${cleanWord}${excludeSpecificUser}&s=indexed&type=Code`
  const githubJScode = `https://github.com/search${formatRequire(word, excludeSpecificUser)}`
  const githubJSImport = `https://github.com/search${formatImport(cleanWord, excludeSpecificUser)}`

  const sourceGraphRequire = `https://sourcegraph.com/search?q=require%5C%28%28%27%7C"%29${word}%28%27%7C"%29%5C%29+%28lang:javascript+OR+lang:typescript%29&patternType=regexp`
  const sourceGraphImport = `https://sourcegraph.com/search?q=%28import.*%28%27%7C"%29${word}%28%27%7C"%29%29%28lang:javascript+OR+lang:typescript%29&patternType=regexp`

  let linksRender
  if(word) {
    linksRender = (
      <div style={{ textAlign: 'left' }}>
        <p>Searching for package "<strong>{word}</strong>"</p>
      
        <p>
          - <a href={githubPkg} target='_blank' rel="noopener">
            Github projects package.json using {word}
          </a>
        </p>
        <p>
          - <a href={githubJSImport} target='_blank' rel="noopener">
           Github projects Javascript <strong>import {word}</strong>
          </a>
        </p>
        <p>
          - <a href={githubJScode} target='_blank' rel="noopener">
            Github projects Javascript <strong>require("{word}") </strong>
          </a>
        </p>
        <p>
          - <a href={codeSandbox} target='_blank' rel="noopener">
            CodeSandbox examples of {word}
          </a>
        </p>
        <p>
          - <a href={sourceGraphRequire} target='_blank' rel="noopener">
            SourceGraph <strong>require("{word}") </strong>
          </a>
        </p>
        <p>
          - <a href={sourceGraphImport} target='_blank' rel="noopener">
            SourceGraph <strong>import {word}</strong>
          </a>
        </p>
        <p>
          - <a href={`https://www.google.com/search?q=${word}+-npmjs.com+-amazon.com+-amazonaws.cn&biw=2844&bih=1387&tbs=qdr:y`} target='_blank' rel="noopener">
            Google results for <strong>{word}</strong> past year
          </a>
        </p>
      </div>
    )
  }

  let permalinkRender
  if (word) {
    permalinkRender = (
      <a 
        href={`${window.location.origin}?pkg=${word}`}
        style={{ textDecoration: 'none', marginLeft: 12 }}
        target='_blank' rel="noopener"
      >
        🔗
      </a>
    )
  }

  return (
    <div className="App">
      <h1>JS Code Search</h1>
      <p>Search for usage examples of any npm package!</p>
      <div>
        <input 
          ref={inputRef}
          onChange={(e) => setWord(e.target.value)}
          value={word}
          style={{padding: '8px 12px', width: 250, fontSize: 16}}
          placeholder='Enter name of package here'
        />
        {permalinkRender}
      </div>
      {linksRender}
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

function formatRequire(word, excludeSpecificUser) {
  // Github doesnt search for anything prefixed with @ for some reason
  if (word.startsWith('@')) {
    const newWord = word.split('/')[1]
    return `?l=JavaScript&o=desc&s=indexed&q=require+${newWord}+language%3AJavaScript+language%3ATypeScript${excludeSpecificUser}&type=Code`
  }
  return `?l=JavaScript&o=desc&s=indexed&q=require+${word}+language%3AJavaScript+language%3ATypeScript${excludeSpecificUser}&type=Code`
}

function formatImport(word, excludeSpecificUser) {
  // from word
  return `?l=JavaScript&o=desc&s=indexed&q=from%20"${word}"+language%3AJavaScript+language%3ATypeScript${excludeSpecificUser}&type=Code`
}

function getQueryParams(params, url) {
  let href = url;
  //this expression is to get the query strings
  let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
  let queryString = reg.exec(href);
  return queryString ? queryString[1] : '';
}


export default App;
