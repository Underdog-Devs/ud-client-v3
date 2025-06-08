import { useHealthCheck, useApiInfo } from '@/hooks/api'
import './App.css'

function App() {
  const { data: health, isLoading: healthLoading, error: healthError } = useHealthCheck()
  const { data: apiInfo, isLoading: apiLoading, error: apiError } = useApiInfo()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          UnderdogDevs - React Frontend
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Health Check Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Backend Health Check</h2>
            {healthLoading && <p className="text-gray-600">Loading...</p>}
            {healthError && <p className="text-red-600">Error: Unable to connect to backend</p>}
            {health && (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">✅ Backend is running</p>
                <p><span className="font-medium">Status:</span> {health.status}</p>
                <p><span className="font-medium">Version:</span> {health.version}</p>
                <p><span className="font-medium">Timestamp:</span> {new Date(health.timestamp).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* API Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API Information</h2>
            {apiLoading && <p className="text-gray-600">Loading...</p>}
            {apiError && <p className="text-red-600">Error: Unable to fetch API info</p>}
            {apiInfo && (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {apiInfo.name}</p>
                <p><span className="font-medium">Version:</span> {apiInfo.version}</p>
                <p><span className="font-medium">Environment:</span> {apiInfo.environment}</p>
                <p><span className="font-medium">Debug:</span> {apiInfo.debug ? 'Enabled' : 'Disabled'}</p>
                <p><span className="font-medium">CORS Origins:</span> {apiInfo.cors_origins.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Frontend successfully connected to FastAPI backend!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
