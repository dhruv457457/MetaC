import React from "react";

export default function SwapChart({
  tokenA,
  tokenB,
  chartData = [],
  onRefresh,
  onClearLive,
  loading,
}) {
  const maxPrice = Math.max(...chartData.map((p) => p.price), 0);
  const minPrice = Math.min(...chartData.map((p) => p.price), 0);
  const priceRange = maxPrice - minPrice || 1;

  const gradientPoints = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * 760 + 20;
    const y = 180 - ((point.price - minPrice) / priceRange) * 160;
    return { x, y };
  });

  const polylinePoints = gradientPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {tokenA && tokenB ? `${tokenA.symbol}/${tokenB.symbol}` : "Token"} Price Chart
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {chartData.length > 0 ? `${chartData.length} trades` : "No data"}
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh chart"
          >
            🔄
          </button>
          <button
            onClick={onClearLive}
            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear chart"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="h-64 w-full bg-gradient-to-b from-purple-50 to-blue-50 rounded-2xl p-4 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 800 200" className="overflow-visible">
            <defs>
              <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
              </pattern>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {gradientPoints.length > 1 && (
              <>
                <path
                  d={`M ${gradientPoints[0].x},180 L ${polylinePoints} L ${gradientPoints.at(-1).x},180 Z`}
                  fill="url(#priceGradient)"
                />
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {gradientPoints.map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="white"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>
                      Price: {chartData[i].price.toFixed(6)} {tokenB?.symbol}/{tokenA?.symbol}
                      {"\n"}Time: {new Date(chartData[i].timestamp * 1000).toLocaleString()}
                      {"\n"}Volume: {chartData[i].volume.toFixed(4)} {tokenA?.symbol}
                    </title>
                  </circle>
                ))}
              </>
            )}
          </svg>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600">Current Price</div>
            <div className="font-semibold text-purple-600">
              {chartData.length > 0 ? chartData.at(-1).price.toFixed(6) : "0.000000"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">24h High</div>
            <div className="font-semibold text-green-600">
              {chartData.length > 0 ? maxPrice.toFixed(6) : "0.000000"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">24h Low</div>
            <div className="font-semibold text-red-600">
              {chartData.length > 0 ? minPrice.toFixed(6) : "0.000000"}
            </div>
          </div>
        </div>

        {chartData.length === 0 && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <span>📊</span>
              <span>No data yet — Refresh or trade to generate chart!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
