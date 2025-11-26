import { useState, useEffect } from 'react';
import { Upload, Twitch, Video, Radio, Users, X, Play, Trash2, Trophy } from 'lucide-react';

const API_URL = 'https://w3tb3ans.com/api';

export default function GamingHub() {
  const [activeTab, setActiveTab] = useState('live');
  const [clips, setClips] = useState([]);
  const [members, setMembers] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newClip, setNewClip] = useState({ title: '', game: '', url: '', uploader: '' });
  const [newMember, setNewMember] = useState({ name: '', twitch: '', isLive: false, streamTitle: '', game: '' });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clipsRes, membersRes] = await Promise.all([
          fetch(`${API_URL}/clips`),
          fetch(`${API_URL}/members`)
        ]);
        setClips(await clipsRes.json());
        setMembers(await membersRes.json());
      } catch (e) {
        console.error('Failed to load data:', e);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  const handleUploadClip = async () => {
    if (newClip.title && newClip.url) {
      try {
        const res = await fetch(`${API_URL}/clips`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newClip, date: new Date().toISOString().split('T')[0] })
        });
        const clip = await res.json();
        setClips([clip, ...clips]);
        setNewClip({ title: '', game: '', url: '', uploader: '' });
        setShowUploadModal(false);
      } catch (e) {
        console.error('Failed to add clip:', e);
      }
    }
  };

  const handleAddMember = async () => {
    if (newMember.name && newMember.twitch) {
      try {
        const res = await fetch(`${API_URL}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMember)
        });
        const member = await res.json();
        setMembers([member, ...members]);
        setNewMember({ name: '', twitch: '', isLive: false, streamTitle: '', game: '' });
        setShowAddMemberModal(false);
      } catch (e) {
        console.error('Failed to add member:', e);
      }
    }
  };

  const deleteClip = async (id) => {
    try {
      await fetch(`${API_URL}/clips/${id}`, { method: 'DELETE' });
      setClips(clips.filter(c => c.id !== id));
    } catch (e) {
      console.error('Failed to delete clip:', e);
    }
  };

  const deleteMember = async (id) => {
    try {
      await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== id));
    } catch (e) {
      console.error('Failed to delete member:', e);
    }
  };

  const toggleLive = async (id) => {
    try {
      const res = await fetch(`${API_URL}/members/${id}/toggle-live`, { method: 'PATCH' });
      const updated = await res.json();
      setMembers(members.map(m => m.id === id ? { ...m, isLive: updated.isLive } : m));
    } catch (e) {
      console.error('Failed to toggle live:', e);
    }
  };

  const liveMembers = members.filter(m => m.isLive);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Trophy className="text-cyan-400 mx-auto mb-4 animate-pulse" size={48} />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-cyan-400 flex-shrink-0" size={24} />
            <span className="truncate">W3T B3AnS</span>
          </h1>
          {liveMembers.length > 0 && (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm text-red-400">{liveMembers.length} Live</span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-2 sm:px-6 flex">
          {[
            { id: 'live', icon: Radio, label: 'Live' },
            { id: 'clips', icon: Video, label: 'Clips' },
            { id: 'members', icon: Users, label: 'Squad' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-4 font-medium transition-all border-t-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id 
                  ? 'border-cyan-400 text-white bg-gray-800/50' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === 'live' && liveMembers.length > 0 && (
                <span className="bg-red-500 text-xs px-1.5 py-0.5 rounded-full">{liveMembers.length}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">

        {/* Live Streams Tab */}
        {activeTab === 'live' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Live Streams</h2>
            {liveMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {liveMembers.map(member => (
                  <div key={member.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="aspect-video bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center relative">
                      <Users size={48} className="text-gray-600" />
                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-2 py-1 rounded text-xs sm:text-sm">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-base sm:text-lg">{member.name}</h3>
                      <p className="text-cyan-400 text-sm">{member.game}</p>
                      <p className="text-gray-300 mt-2 mb-4 text-sm">{member.streamTitle}</p>
                      <a href={member.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 py-2.5 sm:py-3 rounded-lg transition-colors text-sm">
                        <Twitch size={18} /> Watch on Twitch
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Radio size={48} className="mx-auto mb-4 opacity-50" />
                <p>No one is streaming right now.</p>
              </div>
            )}
          </div>
        )}

        {/* Clips Tab */}
        {activeTab === 'clips' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Gaming Clips</h2>
              <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm">
                <Upload size={16} /> Upload
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clips.map(clip => (
                <div key={clip.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all group">
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                    <Video size={40} className="text-gray-600" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={40} className="text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate text-sm sm:text-base">{clip.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{clip.game} • {clip.uploader}</p>
                    <p className="text-gray-500 text-xs mt-1">{clip.date}</p>
                    <div className="flex gap-2 mt-3">
                      <a href={clip.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-center py-2 rounded-lg text-sm transition-colors">Watch</a>
                      <button onClick={() => deleteClip(clip.id)} className="p-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {clips.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Video size={48} className="mx-auto mb-4 opacity-50" />
                <p>No clips uploaded yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">The Squad</h2>
              <button onClick={() => setShowAddMemberModal(true)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm">
                <Users size={16} /> Add
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map(member => (
                <div key={member.id} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Users size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base sm:text-lg truncate">{member.name}</h3>
                      <button onClick={() => toggleLive(member.id)} className={`text-xs px-2 py-1 rounded-full ${member.isLive ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-gray-700 text-gray-400'}`}>
                        {member.isLive ? '🔴 Live' : '⚫ Offline'}
                      </button>
                    </div>
                  </div>
                  {member.isLive && <p className="text-gray-400 text-xs sm:text-sm mb-3">Playing: {member.game}</p>}
                  <div className="flex gap-2">
                    <a href={member.twitch} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors text-sm">
                      <Twitch size={14} /> Twitch
                    </a>
                    <button onClick={() => deleteMember(member.id)} className="p-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upload Clip Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Upload Clip</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white p-1"><X size={24} /></button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <input type="text" placeholder="Clip Title" value={newClip.title} onChange={e => setNewClip({...newClip, title: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm sm:text-base" />
              <input type="text" placeholder="Game" value={newClip.game} onChange={e => setNewClip({...newClip, game: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm sm:text-base" />
              <input type="text" placeholder="Your Name" value={newClip.uploader} onChange={e => setNewClip({...newClip, uploader: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm sm:text-base" />
              <input type="url" placeholder="Clip URL" value={newClip.url} onChange={e => setNewClip({...newClip, url: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm sm:text-base" />
              <button onClick={handleUploadClip} className="w-full bg-cyan-600 hover:bg-cyan-700 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors">Upload Clip</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Add Squad Member</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-gray-400 hover:text-white p-1"><X size={24} /></button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <input type="text" placeholder="Gamer Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm sm:text-base" />
              <input type="url" placeholder="Twitch URL" value={newMember.twitch} onChange={e => setNewMember({...newMember, twitch: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm sm:text-base" />
              <button onClick={handleAddMember} className="w-full bg-cyan-600 hover:bg-cyan-700 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors">Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}