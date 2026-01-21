'use client'

import { useState, useEffect } from 'react'

interface ConnectionStatus {
  connected: boolean
  connection: {
    id: string
    instagram_business_account_id: string
    username: string | null
    last_synced_at: string | null
    sync_enabled: boolean
    token_expires_at: string | null
  } | null
}

export default function InstagramConnection() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    instagram_business_account_id: '',
    access_token: '',
    username: '',
  })

  useEffect(() => {
    fetchConnectionStatus()
  }, [])

  const fetchConnectionStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/instagram/connect')
      const data = await response.json()
      setStatus(data)
      if (data.connected && data.connection) {
        setFormData({
          instagram_business_account_id: data.connection.instagram_business_account_id || '',
          access_token: '',
          username: data.connection.username || '',
        })
      }
    } catch (err) {
      setError('Failed to fetch connection status')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch('/api/admin/instagram/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect Instagram')
      }

      setShowForm(false)
      fetchConnectionStatus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/instagram/sync', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync posts')
      }

      alert(`Sync completed!\n- New posts: ${data.synced}\n- Updated: ${data.updated}\n- Errors: ${data.errors}`)
      fetchConnectionStatus()
      // Refresh the page to show new posts
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync')
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Instagram? This will stop automatic syncing.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/instagram/connect', {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to disconnect')

      setStatus({ connected: false, connection: null })
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect')
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading connection status...</div>
  }

  const isConnected = status?.connected && status?.connection

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Instagram Connection</h2>
        {isConnected && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : '🔄 Sync Now'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-semibold text-green-700">API Connected (Optional)</span>
          </div>
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> You can also import posts manually using URLs below - no API needed!
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Username</label>
              <p className="text-gray-800">{status.connection?.username || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Account ID</label>
              <p className="text-gray-800 font-mono text-sm">{status.connection?.instagram_business_account_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Synced</label>
              <p className="text-gray-800">
                {status.connection?.last_synced_at
                  ? new Date(status.connection.last_synced_at).toLocaleString()
                  : 'Never'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Token Expires</label>
              <p className="text-gray-800">
                {status.connection?.token_expires_at
                  ? new Date(status.connection.token_expires_at).toLocaleDateString()
                  : 'No expiration'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Connection
            </button>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-2">Instagram API not connected (optional)</p>
          <p className="text-sm text-gray-500 mb-4">
            You can import posts manually using URLs below, or connect API for automatic syncing
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Connect Instagram API (Optional)
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-4">
            {isConnected ? 'Update Instagram Connection' : 'Connect Instagram Account'}
          </h3>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">How to get your credentials:</p>
            <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
              <li>Go to <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Facebook Developers</a> and create an app (or use existing)</li>
              <li><strong>Add "Instagram" product:</strong> In your app dashboard, find "Instagram" in the products list and click "Set Up"</li>
              <li>Connect your Instagram Business/Creator account to a Facebook Page</li>
              <li>Use <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="underline">Graph API Explorer</a> to get Access Token</li>
              <li>Get Instagram Business Account ID from Facebook Page → Settings → Instagram</li>
              <li>Paste them below</li>
            </ol>
            <div className="mt-3 p-3 bg-white rounded border border-blue-300">
              <p className="text-xs text-blue-900 font-semibold mb-1">📘 Quick Guide:</p>
              <p className="text-xs text-blue-700">
                See <code className="bg-blue-100 px-1 rounded">FACEBOOK_APP_INSTAGRAM_SETUP.md</code> for detailed step-by-step instructions, or <code className="bg-blue-100 px-1 rounded">INSTAGRAM_API_QUICK_START.md</code> for the fast version.
              </p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              💡 <strong>Tip:</strong> Adding the "Instagram" product is just clicking "Set Up" next to it in your app dashboard. No complex setup needed!
            </p>
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram Business Account ID *
              </label>
              <input
                type="text"
                required
                value={formData.instagram_business_account_id}
                onChange={(e) => setFormData({ ...formData, instagram_business_account_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 17841405309211844"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token *
              </label>
              <input
                type="password"
                required
                value={formData.access_token}
                onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Long-lived access token"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a long-lived token (60 days) or page access token
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username (optional)
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., hoadaoofficial"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg"
              >
                {isConnected ? 'Update' : 'Connect'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setError(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
