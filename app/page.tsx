'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newUserMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader from response body.');
      }

      const decoder = new TextDecoder();
      let assistantMessage = '';
      setMessages([...updatedMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.substring(6);
            if (jsonString === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(jsonString);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                assistantMessage += content;
                setMessages((currentMsgs) => {
                  const lastMsg = currentMsgs[currentMsgs.length - 1];
                  if (lastMsg && lastMsg.role === 'assistant') {
                    return [
                      ...currentMsgs.slice(0, -1),
                      { ...lastMsg, content: assistantMessage },
                    ];
                  } else {
                    return [
                      ...currentMsgs,
                      { role: 'assistant', content: assistantMessage },
                    ];
                  }
                });
              }
            } catch (e) {
              console.error('Error parsing JSON from stream:', e, 'JSON string:', jsonString);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((currentMsgs) => [
        ...currentMsgs,
        { role: 'assistant', content: 'Sorry, I am having trouble connecting. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">AI Chatbot</h1>
      <div className="card">
        <div className="card-header">Chat History</div>
        <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
            >
              <div
                className={`badge ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary'} p-2 text-wrap`}
                style={{ maxWidth: '70%' }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex justify-content-start mb-2">
              <div className="badge bg-secondary p-2">Typing...</div>
            </div>
          )}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
