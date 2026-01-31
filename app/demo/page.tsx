'use client'

import { HoodiniDemo } from '../components/HoodiniDemo'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Demo container */}
      <div className="w-full" style={{ height: 'calc(100vh - 64px)' }}>
        <HoodiniDemo 
          type="dashboard"
          height="100%"
        />
      </div>
    </div>
  )
}
