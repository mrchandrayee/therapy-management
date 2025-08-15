'use client'

export function TailwindTest() {
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tailwind CSS Test</h2>
        <p className="text-gray-500">Testing if Tailwind CSS is working properly</p>
      </div>
      
      <div className="space-y-4">
        {/* Color Test */}
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-primary-500 rounded flex items-center justify-center text-white text-xs">
            Primary
          </div>
          <div className="h-12 bg-secondary-500 rounded flex items-center justify-center text-white text-xs">
            Secondary
          </div>
          <div className="h-12 bg-green-500 rounded flex items-center justify-center text-white text-xs">
            Success
          </div>
        </div>
        
        {/* Button Test */}
        <div className="space-y-2">
          <button className="btn-primary w-full">Primary Button</button>
          <button className="btn-secondary w-full">Secondary Button</button>
          <button className="btn-outline w-full">Outline Button</button>
        </div>
        
        {/* Card Test */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Card Title</h3>
            <p className="card-description">This is a card description</p>
          </div>
          <div className="card-content">
            <p>Card content goes here</p>
          </div>
        </div>
        
        {/* Badge Test */}
        <div className="flex space-x-2">
          <span className="badge-primary">Primary</span>
          <span className="badge-success">Success</span>
          <span className="badge-warning">Warning</span>
          <span className="badge-error">Error</span>
        </div>
        
        {/* Animation Test */}
        <div className="animate-fade-in">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">This should fade in with animation</p>
          </div>
        </div>
        
        {/* Gradient Test */}
        <div className="gradient-primary p-4 rounded-lg text-white text-center">
          Gradient Background
        </div>
        
        {/* Responsive Test */}
        <div className="text-responsive-base text-center">
          Responsive text that changes size on different screens
        </div>
      </div>
    </div>
  )
}