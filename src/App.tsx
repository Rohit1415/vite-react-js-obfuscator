import { useState } from "react";
import { helper } from "./utils/helper";

const App = () => {
  const [input, setInput] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState<any>(null);

  const handleEncrypt = () => {
    const data = {
      message: input,
      time: new Date(),
    };

    const res = helper.encryptData(data);
    setEncrypted(res);
  };

  const handleDecrypt = () => {
    const res = helper.decryptData(encrypted);
    setDecrypted(res);
  };

  return (
    <div className="container">
      <h2>🔐 Encrypt Any Data</h2>

      <input
        className="input"
        placeholder="Enter something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="btn-group">
        <button className="btn" onClick={handleEncrypt}>
          Encrypt
        </button>
        <button className="btn" onClick={handleDecrypt}>
          Decrypt
        </button>
      </div>

      <div className="output">
        <p>
          <strong>Encrypted:</strong>
        </p>
        <textarea value={encrypted} readOnly />

        <p>
          <strong>Decrypted:</strong>
        </p>
        <pre>{JSON.stringify(decrypted, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
