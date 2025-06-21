import { useState } from "react";

// ✅ Update this list with your actual token data
const tokenList = [
  { symbol: "TKA", address: "0x8b0C1326D16eC18B7af6F75A352Cb0fFe8862e44" },
  { symbol: "TKB", address: "0xae9e16b1fa7FA2962Ade8758c171E619f780f516" },
  { symbol: "USDT", address: "0xC832785d6b0207708c4b7D1f1c2cF7809268d7e3" },
  { symbol: "MOO", address: "0x9ce3BF7A31512c143Aad88BC92E1899b2FD862Dc" },
];

export default function TokenSelector({ selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (token) => {
    onSelect?.(token); // safely call onSelect if defined
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full border px-4 py-2 rounded-lg bg-white flex justify-between items-center hover:border-purple-400 transition"
      >
        <span className="text-gray-800">
          {selected?.symbol || "Select Token"}
        </span>
        <span className="text-gray-500">&#9662;</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 bg-white border w-full mt-2 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {tokenList.map((token) => (
            <li
              key={token.address}
              onClick={() => handleSelect(token)}
              className={`px-4 py-2 hover:bg-purple-100 cursor-pointer ${
                token.address === selected?.address ? "text-blue-600 font-medium" : ""
              }`}
            >
              {token.symbol}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
