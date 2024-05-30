import { useState } from 'react'

const BUTTONS = [
  { type: "operation", keyName: 'clear', label: 'C' },
  { type: "operation", keyName: 'delete', label: '←' },
  { type: "number", keyName: 'number1', label: '1' },
  { type: "number", keyName: 'number2', label: '2' },
  { type: "number", keyName: 'number3', label: '3' },
  { type: "number", keyName: 'number4', label: '4' },
  { type: "number", keyName: 'number5', label: '5' },
  { type: "number", keyName: 'number6', label: '6' },
  { type: "number", keyName: 'number7', label: '7' },
  { type: "number", keyName: 'number8', label: '8' },
  { type: "number", keyName: 'number9', label: '9' },
  { type: "number", keyName: 'number0', label: '0' },
  { type: "operation", keyName: 'multiply', label: '×' },
  { type: "operation", keyName: 'divide', label: '÷' },
  { type: "operation", keyName: 'add', label: '+' },
  { type: "operation", keyName: 'subtract', label: '-' },
  { type: "operation", keyName: 'dot', label: '.' },
  { type: "operation", keyName: 'evaluate', label: '=' },
];

function Button({ keyName, label, onClick }) {
  return (
    <button style={{ gridArea: keyName }} className={`button ${keyName}`} onClick={onClick}>
      {label}
    </button>
  );
}

function Screen({ value }) {
  return (
    <div className="screen">
      <span>{value}</span>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState([])

  const handleClick = ({type, keyName, label}) => {
    if (keyName === 'evaluate') {
      setQuery((prev) => [evaluateResult(prev)])
      return
    }
    if (keyName === 'clear') {
      setQuery([])
      return
    }
    if (keyName === 'delete') {
      setQuery((prev) => prev.slice(0, -1))
      return
    }
    setQuery((prev) => [...prev, {type, keyName, label}])
  }

  const evaluateResult = (query) => {
    return query.join('')
  }

  const stringifyResult = () => {
    if (query.length === 0) {
      return 0
    }
    let result = ''
    let prev = undefined
    query.forEach((entry, index) => {
      if (index > 0 && (entry.type !== 'number' || prev.type !=='number')) {
        result += ' '
      }
      result += entry.label
      prev = entry
    })
    return result
  }

  return (
    <div className="calculator">
      <Screen value={stringifyResult()} />
      {BUTTONS.map((button) => (
        <Button key={button.keyName} keyName={button.keyName} label={button.label} onClick={() => handleClick({ type: button.type, keyName: button.keyName, label: button.label })} />
      ))}
    </div>
  );
}