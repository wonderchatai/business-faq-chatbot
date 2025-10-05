import { useState } from 'react'

export { Page }

function Page() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: input })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let assistantMessage = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, '').trim())
        .filter((line) => line !== '' && line !== '[DONE]')
        .map((line) => JSON.parse(line))

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine
        const { delta } = choices[0]
        if (delta.content) {
          assistantMessage += delta.content
          setMessages([...newMessages, { role: 'assistant', content: assistantMessage }])
        }
      }
    }
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">Chatbot</div>
        <div className="card-body" style={{ height: '400px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
              <span className={`badge ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
