import React from "react";
import TokenSelector from "../TokenSelector";

export default function SwapForm({
  tokenA,
  tokenB,
  amountIn,
  amountOut,
  onAmountInChange,
  onTokenAChange,
  onTokenBChange,
  onSwitch,
  onSwap,
  loading,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
      <div className="space-y-6">
        {/* From Token */}
        <div className="space-y-3">
          <label className="text-gray-700 font-semibold">From</label>
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-transparent focus-within:border-purple-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountIn}
                  onChange={(e) => onAmountInChange(e.target.value)}
                  className="w-full bg-transparent text-2xl font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {amountIn && tokenA
                    ? `~$${(parseFloat(amountIn) * 2000).toFixed(2)}`
                    : ""}
                </div>
              </div>
              <TokenSelector selected={tokenA} onSelect={onTokenAChange} />
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center">
          <button
            onClick={onSwitch}
            className="bg-white border-2 border-gray-200 hover:border-purple-300 text-gray-600 hover:text-purple-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <svg
              className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <div className="space-y-3">
          <label className="text-gray-700 font-semibold">To</label>
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-transparent">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="0.0"
                  value={amountOut}
                  disabled
                  className="w-full bg-transparent text-2xl font-semibold text-gray-600 placeholder-gray-400 focus:outline-none"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {amountOut && tokenB
                    ? `~$${(parseFloat(amountOut) * 2000).toFixed(2)}`
                    : ""}
                </div>
              </div>
              <TokenSelector selected={tokenB} onSelect={onTokenBChange} />
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {tokenA && tokenB && amountIn && amountOut && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rate</span>
              <span className="font-medium">
                1 {tokenA.symbol} ={" "}
                {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)}{" "}
                {tokenB.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price Impact</span>
              <span className="font-medium text-green-600">&lt; 0.01%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Network Fee</span>
              <span className="font-medium">~$2.50</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={onSwap}
          disabled={loading || !tokenA || !tokenB || !amountIn}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Swapping...
            </div>
          ) : !tokenA || !tokenB ? (
            "Select Tokens"
          ) : !amountIn ? (
            "Enter Amount"
          ) : (
            `Swap ${tokenA.symbol} for ${tokenB.symbol}`
          )}
        </button>
      </div>
    </div>
  );
}
