import { useEffect, useState, useRef, forwardRef } from 'react'

const BUTTONS = [
  { type: "number", keyName: 'number1', label: '1', keyPress: '1'},
  { type: "number", keyName: 'number2', label: '2', keyPress: '2' },
  { type: "number", keyName: 'number3', label: '3', keyPress: '3' },
  { type: "number", keyName: 'number4', label: '4', keyPress: '4' },
  { type: "number", keyName: 'number5', label: '5', keyPress: '5' },
  { type: "number", keyName: 'number6', label: '6', keyPress: '6' },
  { type: "number", keyName: 'number7', label: '7', keyPress: '7' },
  { type: "number", keyName: 'number8', label: '8', keyPress: '8' },
  { type: "number", keyName: 'number9', label: '9', keyPress: '9' },
  { type: "number", keyName: 'number0', label: '0', keyPress: '0' },
  { type: "dot", keyName: 'dot', label: '.', keyPress: '.' },
  { type: "operation", keyName: 'add', label: '+', keyPress: '+' },
  { type: "operation", keyName: 'subtract', label: '-', keyPress: '-' },
  { type: "operation", keyName: 'multiply', label: '×', keyPress: '*' },
  { type: "operation", keyName: 'divide', label: '/', keyPress: '/' },
  { type: "operation", keyName: 'evaluate', label: '=', keyPress: 'Enter' },
  { type: "operation", keyName: 'clear', label: 'c', keyPress: 'c' },
  { type: "operation", keyName: 'delete', label: '←', keyPress: 'Backspace' },
];

const Button = forwardRef(function Button({ keyName, label, onClick }, ref) {
  return (
    <button
      style={{ gridArea: keyName }}
      className={`button ${keyName}`}
      onClick={onClick}
      ref={ref}
    >
      {label}
    </button>
  );
})

function Screen({ value }) {
  return (
    <div className="screen">
      <span>{value}</span>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState([])

  const buttonRefs = useRef({})

  useEffect(() => {
    const handleKeyDown = (event) => handleKeyPress(event.key)
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleKeyPress = (key) => {
    const buttonRef = buttonRefs.current[key];
    if (buttonRef === undefined) {
      return
    }
    buttonRef.click()
  };

  const handleClick = ({type, keyName, label}) => {
    if (keyName === 'evaluate') {
      setQuery([{type: 'number', label: evaluateResult(), result: true}])
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
    if (keyName === 'multiply' || keyName === 'divide' || keyName === 'add') {
      if (query.length === 0 || query[query.length - 1].type === 'operation') {
        return
      }
    }
    if (keyName === 'subtract') {
      if (query[query.length - 1]?.keyName === 'subtract') {
        return
      }
    }
    if (keyName === 'dot') {
      if (query.length === 1 && query[0].result) {
        setQuery([])
      }
      let seenDot = false
      let seenOperator = false
      let dotIsValid = true
      query.slice().reverse().forEach((item) => {
        if (item.keyName === 'dot') {
          seenDot = true
        }
        if (item.type === 'operation') {
          seenOperator = true
        }
        if (seenDot !== seenOperator) {
          dotIsValid = !seenDot
        }
      })
      if (!dotIsValid) {
        return
      }
    }
    if (type === 'number') {
      if (query.length === 1 && query[0].result) {
        setQuery([])
      }
    }
    setQuery((prev) => [...prev, {type, keyName, label}])
  }

  const evaluateResult = () => {
    const string = query.reduce((acc, cur) => acc += cur.label, '').replace('×','*').replace('÷','/')
    try {
      return eval(string).toString()
    } 
    catch (error) {
      return '0'
    }
  }

  const stringifyResult = () => {
    if (query.length === 0) {
      return '0'
    }
    return query.reduce((acc, cur) => acc += cur.label, '')
  }

  return (
    <div className="calculator">
      <Screen value={stringifyResult()} />
      {BUTTONS.map(({ type, keyName, label, keyPress }) => (
        <Button
          key={keyName}
          keyName={keyName}
          label={label}
          onClick={() => handleClick({ type, keyName, label })}
          ref={element => buttonRefs.current[keyPress] = element}
        />
      ))}
    </div>
  );
}