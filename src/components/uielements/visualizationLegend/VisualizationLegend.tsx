"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, BarChart3, ArrowUpDown, Activity, Zap, Target } from "lucide-react"
import { useState } from "react"

export function VisualizationLegend() {
  const [activeTab, setActiveTab] = useState<'volatility' | 'liquidity' | 'performance'>('volatility')

  const tabs: Array<{ id: 'volatility' | 'liquidity' | 'performance'; label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = [
    { id: 'volatility', label: 'Volatility', icon: TrendingUp, color: 'text-[#bb9c2d]' },
    { id: 'liquidity', label: 'Liquidity', icon: BarChart3, color: 'text-[#7c8796]' },
    { id: 'performance', label: 'Performance', icon: ArrowUpDown, color: 'text-[#7c8796]' }
  ]

  const renderVolatilityContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-5 w-5 text-[#bb9c2d]" />
        <h3 className="text-lg font-semibold text-white">Volatility Heatmap</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center space-x-3 p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div 
            className="w-6 h-6 rounded"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0.10) 30%, rgba(22,163,74,0.06) 60%, rgba(22,163,74,0.02) 100%)"
            }}
          ></div>
          <div>
            <div className="text-sm font-medium text-white">Low</div>
            <div className="text-xs text-[#7c8796]">0-30%</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div 
            className="w-6 h-6 rounded"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.10) 30%, rgba(251,191,36,0.06) 60%, rgba(251,191,36,0.02) 100%)"
            }}
          ></div>
          <div>
            <div className="text-sm font-medium text-white">Medium</div>
            <div className="text-xs text-[#7c8796]">31-80%</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div 
            className="w-6 h-6 rounded"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(248,113,113,0.15) 0%, rgba(248,113,113,0.10) 30%, rgba(248,113,113,0.06) 60%, rgba(248,113,113,0.02) 100%)"
            }}
          ></div>
          <div>
            <div className="text-sm font-medium text-white">High</div>
            <div className="text-xs text-[#7c8796]">81%+</div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-[#7c8796] leading-relaxed">
        The volatility heatmap uses gradient intensity to represent price volatility levels. 
        Green gradients indicate stable prices, yellow shows moderate volatility, and red signals high volatility.
      </p>
    </div>
  )

  const renderLiquidityContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-5 w-5 text-[#bb9c2d]" />
        <h3 className="text-lg font-semibold text-white">Liquidity Indicators</h3>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div className="text-sm font-medium text-white mb-2">Volume Patterns</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#2a2d36] rounded opacity-40"></div>
              <span className="text-xs text-[#7c8796]">Low Volume</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#2a2d36] rounded opacity-60"></div>
              <span className="text-xs text-[#7c8796]">Medium Volume</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#2a2d36] rounded opacity-80"></div>
              <span className="text-xs text-[#7c8796]">High Volume</span>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div className="text-sm font-medium text-white mb-2">Sparkline Trends</div>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-8 bg-[#1e2126] rounded border border-[#2a2d36] flex items-center justify-center">
              <div className="w-12 h-0.5 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-xs text-[#7c8796]">7-day price trend</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-[#7c8796] leading-relaxed">
        Liquidity indicators show trading volume through opacity levels and display 7-day price trends 
        using sparklines at the bottom of each calendar cell.
      </p>
    </div>
  )

  const renderPerformanceContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-5 w-5 text-[#bb9c2d]" />
        <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center space-x-3 p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div 
            className="w-6 h-6 rounded"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.10) 30%, rgba(34,197,94,0.06) 60%, rgba(34,197,94,0.02) 100%)"
            }}
          ></div>
          <div>
            <div className="text-sm font-medium text-white">Positive</div>
            <div className="text-xs text-[#7c8796]">Green gradient</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div 
            className="w-6 h-6 rounded"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(220,38,38,0.10) 30%, rgba(220,38,38,0.06) 60%, rgba(220,38,38,0.02) 100%)"
            }}
          ></div>
          <div>
            <div className="text-sm font-medium text-white">Negative</div>
            <div className="text-xs text-[#7c8796]">Red gradient</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
          <div 
            className="w-6 h-6 rounded"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(156,163,175,0.15) 0%, rgba(156,163,175,0.10) 30%, rgba(156,163,175,0.06) 60%, rgba(156,163,175,0.02) 100%)"
            }}
          ></div>
          <div>
            <div className="text-sm font-medium text-white">Neutral</div>
            <div className="text-xs text-[#7c8796]">Gray gradient</div>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-[#1a1d24] rounded-lg border border-[#2a2d36]">
        <div className="text-sm font-medium text-white mb-2">Performance Indicators</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-t from-green-400/20 to-transparent rounded"></div>
            <span className="text-xs text-[#7c8796]">Upward trend = Positive returns</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-b from-red-400/20 to-transparent rounded"></div>
            <span className="text-xs text-[#7c8796]">Downward trend = Negative returns</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-[#7c8796] leading-relaxed">
        Performance metrics use color gradients to show price changes. Green gradients indicate positive returns, 
        red gradients show negative returns, and gray represents neutral performance.
      </p>
    </div>
  )

  return (
    <Card className="mt-4 bg-[#1a1d24] border-[#2a2d36]">
      <CardContent className="p-6">
        {/* Custom Tab Navigation */}
        <div className="flex space-x-1 mb-6 p-1 bg-[#0a0a0a] rounded-lg border border-[#2a2d36]">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 flex-1 justify-center ${
                  isActive 
                    ? 'bg-[#bb9c2d] text-white shadow-lg' 
                    : 'text-[#7c8796] hover:text-white hover:bg-[#2a2d36]/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'volatility' && renderVolatilityContent()}
          {activeTab === 'liquidity' && renderLiquidityContent()}
          {activeTab === 'performance' && renderPerformanceContent()}
        </div>
      </CardContent>
    </Card>
  )
}
