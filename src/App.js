import { useState, useRef, useEffect } from 'react'
import './App.css';

const initial = getQueryParams('pkg', window.location.href)
const exclude = window.localStorage.getItem('excludeUser') || ''

function Link({ href, children }) {
  return (
    <a href={href} target='_blank' rel="noopener">
      {children}
    </a>
  )
}

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
  const githubPkg = `https://github.com/search?q=path%3Apackage.json+%2F%5C"${word}%5C"%5Cs*%3A%5Cs*%5C"%5Cd%2B%5C.%5Cd%2B%5C.%5Cd%2B%5C"%2F+NOT+removeWord&s=indexed&type=code`
  const githubJSRequire = `https://github.com/search${formatRequire(word, excludeSpecificUser)}`
  const githubJSImport = `https://github.com/search${formatImport(cleanWord, excludeSpecificUser)}`
  const githubJSCode = `https://github.com/search?type=code&q=${word}+%28language%3AJavaScript+OR+language%3ATypeScript%29`

  const sourceGraphRequire = `https://sourcegraph.com/search?q=require%5C%28%28%27%7C"%29${word}%28%27%7C"%29%5C%29+%28lang:javascript+OR+lang:typescript%29&patternType=regexp`
  const sourceGraphImport = `https://sourcegraph.com/search?q=%28import.*%28%27%7C"%29${word}%28%27%7C"%29%29%28lang:javascript+OR+lang:typescript%29&patternType=regexp`
  const sourceGraphPkg = `https://sourcegraph.com/search?q=context:global+%28${word}28lang:JSON%29&patternType=regexp`

  let linksRender
  if(word) {
    linksRender = (
      <div style={{ textAlign: 'left' }}>
        <p>Searching for package "<strong>{word}</strong>"</p>
      
        <p>
          - <Link href={githubPkg}> 
              Github projects package.json using {word}
            </Link>
        </p>
        <p>
          - <Link href={githubJSImport}>
           Github projects Javascript <strong>import {word}</strong>
            </Link>
        </p>
        <p>
          - <Link href={githubJSRequire}>
            Github projects Javascript <strong>require("{word}") </strong>
            </Link>
        </p>
        <p>
          - <Link href={githubJSCode}>
            Github Javascript + TS Code search for <strong>"{word}"</strong>
            </Link>
        </p>
        <p>
          - <Link href={codeSandbox}>
            CodeSandbox examples of {word}
            </Link>
        </p>
        <p>
          - <Link href={sourceGraphPkg}>
            SourceGraph package.json for <strong>{word}</strong>
            </Link>
        </p>
        <p>
          - <Link href={sourceGraphRequire}>
            SourceGraph <strong>require("{word}") </strong>
            </Link>
        </p>
        <p>
          - <Link href={sourceGraphImport}>
            SourceGraph <strong>import {word}</strong>
            </Link>
        </p>
        <p>
          - <Link href={`https://www.google.com/search?q=${word}+-npmjs.com+-amazon.com+-amazonaws.cn&biw=2844&bih=1387&tbs=qdr:y`}>
            Google results for <strong>{word}</strong> past year
            </Link>
        </p>

         <div>
           <h3>Other tools</h3>
           <p>
             - <Link href={`https://npmarket.netlify.app/?q=${word}&from=0`}>
                search npmarket "{word}"
               </Link>
           </p>
            <p>
             - <Link href={`https://repo-review.herokuapp.com/`}>
                search repo-review
               </Link>
           </p>
           <p>
             - <Link href={`https://namae.dev/s/${word}`}>
                Check name availability https://namae.dev/s/{word}
               </Link>
           </p>
           <p>
             - <Link href={`https://instantdomainsearch.com/search/domains?q=${word}`}>
                Domain search for {word}
               </Link>
           </p>
         </div>
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
    return `?o=desc&s=indexed&q=%28"require%28%5C"${newWord}%5C"%29"+OR+"require%28%27${newWord}%27%29"%29+%28path%3A**.js+OR+path%3A**.ts+OR+path%3A**.tsx+OR+path%3A**.esm%29+%28language%3AJavaScript+OR+language%3ATypeScript%29&type=code`
  }
  return `?o=desc&s=indexed&q=%28"require%28%5C"${word}%5C"%29"+OR+"require%28%27${word}%27%29"%29+%28path%3A**.js+OR+path%3A**.ts+OR+path%3A**.tsx+OR+path%3A**.esm%29+%28language%3AJavaScript+OR+language%3ATypeScript%29&type=code`
}

function formatImport(word, excludeSpecificUser) {
  // from word
  return `?q=%28"from+%5C"${word}%5C""+OR+"from+%27${word}%27"%29+%28path%3A**.js+OR+path%3A**.ts+OR+path%3A**.tsx+OR+path%3A**.esm%29+%28language%3AJavaScript+OR+language%3ATypeScript%29&type=code`
}

function getQueryParams(params, url) {
  let href = url;
  //this expression is to get the query strings
  let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
  let queryString = reg.exec(href);
  return queryString ? queryString[1] : '';
}


export default App;
