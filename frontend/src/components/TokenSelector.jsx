import { useState } from "react";

// ✅ Update this list with your actual token data
const tokenList = [
  { symbol: "TKA", address: "0x1e792D4c34c3d04Bd127aFEf0c1696E912c755aa" },
  { symbol: "TKB", address: "0x9e53abdDBFa9DC6A9bCD9D0e5DD7144F2701718D" },
  { symbol: "USDT", address: "0xD9b7b6a9146291f87ea383E47Bf7FEc6b707e699" },
  { symbol: "MOO", address: "0xA18938653750B70DCBbC0DF5a03D9F2e5958D8E8" },
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
