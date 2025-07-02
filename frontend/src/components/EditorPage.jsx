import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import { socket } from '../socket';

const EditorPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const username = location.state?.username || "Anonymous";
  const [code, setCode] = useState('// Start coding here...');
  const [output, setOutput] = useState('');

  useEffect(() => {
    socket.emit("join", { roomId, username });

    socket.on("code-update", (incomingCode) => {
      setCode(incomingCode);
    });

    fetch(`http://localhost:5000/api/code/${roomId}`)
      .then(res => res.json())
      .then(data => {
        if (data.code) setCode(data.code);
      });

    return () => socket.disconnect();
  }, [roomId, username]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
  };

  const handleRun = () => {
    let logs = [];
    const originalLog = console.log;

    try {
      // Intercept console.log
      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      // Run code
      const result = new Function(code)();

      const outputText = logs.length > 0
        ? logs.join("\n")
        : result === undefined
        ? '✔️ Code ran with no output'
        : result;

      setOutput(outputText);
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      // Restore original console.log
      console.log = originalLog;
    }
  };

  const handleSave = () => {
    fetch("http://localhost:5000/api/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, code }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || 'Code saved!');
      });
  };

  return (
    <div className="h-screen bg-gray-950 text-white p-4">
      <div className="mb-2 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Room ID: <span className="text-green-400">{roomId}</span></h2>
          <p>Welcome, <span className="font-bold">{username}</span>!</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(roomId)}
          className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
        >
          📋 Copy Room ID
        </button>
      </div>

      <CodeEditor code={code} onCodeChange={handleCodeChange} />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleRun}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ▶️ Run Code
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          💾 Save Code
        </button>
      </div>

      <div className="bg-gray-800 mt-4 p-3 rounded h-40 overflow-auto">
        <h3 className="font-bold text-lg mb-2">🔍 Output:</h3>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

export default EditorPage;
