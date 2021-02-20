import { useState } from 'react'
import './App.css';

function App() {
  const [ word, setWord ] = useState('')
  const codeSandbox = `https://codesandbox.io/search?refinementList%5Btemplate%5D=&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${word}&refinementList%5Btags%5D=&page=1&configure%5BhitsPerPage%5D=12`
  const githubPkg = `https://github.com/search?o=desc&q=filename%3Apackage.json+%22${word}%22&s=indexed&type=Code`
  const githubJScode = `https://github.com/search?l=JavaScript&o=desc&s=indexed&type=Code&q=require(%22${word}%22)%20OR%20from%20%22${word}%22`
  const sourceGraph = `https://sourcegraph.com/search?q=%22${word}%22+lang:javascript++&patternType=literal`
  return (
    <div className="App">
      <h1>JS Code Search</h1>
      <input 
        onChange={(e) => setWord(e.target.value)}
        value={word}
      />
      <p>Searching for {word}</p>
      <p>
        <a href={codeSandbox} target='_blank' rel="noopener">
          On code sandbox
        </a>
      </p>
      <p>
        <a href={githubPkg} target='_blank' rel="noopener">
          On Github in package.json
        </a>
      </p>
      <p>
        <a href={githubJScode} target='_blank' rel="noopener">
          On Github via require/import statement
        </a>
      </p>
      <p>
        <a href={sourceGraph} target='_blank' rel="noopener">
          On sourceGraph
        </a>
      </p>
    </div>
  )
}

export default App;
