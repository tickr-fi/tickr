'use client';

import { useState, useEffect } from 'react';
import { getUsers, createUser } from '@/actions/users';

export function SimpleDbTest() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState('');
  const [adding, setAdding] = useState(false);
  const [addMessage, setAddMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    
    const result = await getUsers();
    
    if (result.success) {
      setUsers(result.data || []);
      setError(null);
    } else {
      console.error('Error fetching users:', result.error);
      setError(result.error || 'Failed to fetch users');
      setUsers([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!publicKey.trim()) {
      return;
    }
    
    setAdding(true);
    setAddMessage(null);
    
    const result = await createUser(publicKey.trim());
    
    if (result.success) {
      setAddMessage('✅ User added successfully!');
      setPublicKey('');
      // Refresh the users list
      fetchUsers();
    } else {
      setAddMessage(`❌ Error: ${result.error}`);
    }
    
    setAdding(false);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 font-mono text-sm">
      <h3 className="text-lg font-bold mb-3 text-foreground">Users</h3>
      
      {/* Add User Form */}
      <div className="mb-4">
        <h4 className="text-md font-bold mb-2 text-foreground">Add User</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Enter public key..."
            className="flex-1 px-3 py-2 bg-background border border-[#333] rounded text-foreground text-sm focus:outline-none focus:border-primary"
            disabled={adding}
          />
          <button
            onClick={handleAddUser}
            disabled={adding || !publicKey.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-90 disabled:opacity-50"
          >
            {adding ? 'Adding...' : 'Add User'}
          </button>
        </div>
        {addMessage && (
          <div className="mt-2 text-sm">{addMessage}</div>
        )}
      </div>

      {/* Users List */}
      <div>
        <h4 className="text-md font-bold mb-2 text-foreground">Users List ({users.length})</h4>
        {loading ? (
          <div className="text-muted-foreground">Loading users...</div>
        ) : error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : users.length === 0 ? (
          <div className="text-muted-foreground">No users found</div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="p-2 bg-background border border-[#333] rounded">
                <div className="text-foreground">{user.public_key}</div>
                <div className="text-xs text-muted-foreground">
                  ID: {user.id} | Created: {new Date(user.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
