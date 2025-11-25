import { useState } from 'react';
import { Upload, Twitch, Video, Radio, Users, X, Play, Trash2, Calendar, Clock, Trophy, Swords } from 'lucide-react';

// Sample data
const initialClips = [
  { id: 1, title: "Insane Clutch in Valorant", game: "Valorant", uploader: "Player1", url: "https://example.com/clip1", date: "2024-01-15" },
  { id: 2, title: "No-Scope Headshot", game: "CS2", uploader: "Player2", url: "https://example.com/clip2", date: "2024-01-14" },
];

const initialMembers = [
  { id: 1, name: "ShadowX", twitch: "https://twitch.tv/player1", isLive: true, streamTitle: "Ranked Grind!", game: "Valorant" },
  { id: 2, name: "PhoenixRise", twitch: "https://twitch.tv/player2", isLive: false, streamTitle: "", game: "" },
  { id: 3, name: "NightWolf", twitch: "https://twitch.tv/player3", isLive: true, streamTitle: "Chill vibes", game: "Minecraft" },
];

const initialMatches = [
  { id: 1, team1: "ShadowR", team2: "Phoenix Force", score1: 5, score2: 3, date: "November 1, 2024", time: "4:30 pm", status: "past", streamUrl: "#" },
  { id: 2, team1: "Wolves", team2: "Blaze Hunters", score1: null, score2: null, date: "November 14, 2024", time: "4:30 pm", status: "upcoming", streamUrl: "#" },
  { id: 3, team1: "Crimson Raiders", team2: "Sentinels", score1: 8, score2: 9, date: "November 4, 2024", time: "2:00 pm", status: "past", streamUrl: "#" },
];

const sponsors = ["Grapho", "Emblem", "Iconic", "Optimal", "Vectra"];

const TeamLogo = ({ team, side }) => {
  const colors = {
    "ShadowR": "from-red-600 to-red-900",
    "Phoenix Force": "from-blue-500 to-cyan-400",
    "Wolves": "from-yellow-500 to-orange-500",
    "Blaze Hunters": "from-purple-500 to-blue-500",
    "Crimson Raiders": "from-red-500 to-rose-600",
    "Sentinels": "from-orange-500 to-yellow-500",
  };
  return (
    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${colors[team] || 'from-gray-600 to-gray-800'} flex items-center justify-center shadow-lg`}>
      <Swords className="text-white" size={28} />
    </div>
  );
};

export default function GamingHub() {
  const [activeTab, setActiveTab] = useState('matches');
  const [matchFilter, setMatchFilter] = useState('all');
  const [clips, setClips] = useState(initialClips);
  const [members, setMembers] = useState(initialMembers);
  const [matches, setMatches] = useState(initialMatches);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [newClip, setNewClip] = useState({ title: '', game: '', url: '', uploader: '' });
  const [newMember, setNewMember] = useState({ name: '', twitch: '', isLive: false, streamTitle: '', game: '' });
  const [newMatch, setNewMatch] = useState({ team1: '', team2: '', date: '', time: '', status: 'upcoming' });

  const handleUploadClip = () => {
    if (newClip.title && newClip.url) {
      setClips([...clips, { id: Date.now(), ...newClip, date: new Date().toISOString().split('T')[0] }]);
      setNewClip({ title: '', game: '', url: '', uploader: '' });
      setShowUploadModal(false);
    }
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.twitch) {
      setMembers([...members, { id: Date.now(), ...newMember }]);
      setNewMember({ name: '', twitch: '', isLive: false, streamTitle: '', game: '' });
      setShowAddMemberModal(false);
    }
  };

  const handleAddMatch = () => {
    if (newMatch.team1 && newMatch.team2) {
      setMatches([...matches, { id: Date.now(), ...newMatch, score1: null, score2: null, streamUrl: '#' }]);
      setNewMatch({ team1: '', team2: '', date: '', time: '', status: 'upcoming' });
      setShowAddMatchModal(false);
    }
  };

  const deleteClip = (id) => setClips(clips.filter(c => c.id !== id));
  const deleteMember = (id) => setMembers(members.filter(m => m.id !== id));
  const deleteMatch = (id) => setMatches(matches.filter(m => m.id !== id));
  const toggleLive = (id) => setMembers(members.map(m => m.id === id ? {...m, isLive: !m.isLive} : m));

  const liveMembers = members.filter(m => m.isLive);
  const filteredMatches = matchFilter === 'all' ? matches : matches.filter(m => m.status === matchFilter);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-cyan-400" size={28} />
            <span>Gaming Squad - W3T B3AnS</span>
          </h1>
          <div className="flex items-center gap-4">
            {liveMembers.length > 0 && (
              <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-red-400">{liveMembers.length} Live</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sponsors Bar */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-8">
          <span className="text-cyan-400 font-semibold whitespace-nowrap">Our sponsors</span>
          <div className="h-6 w-px bg-gray-600"></div>
          <div className="flex items-center gap-8 overflow-x-auto">
            {sponsors.map((s, i) => (
              <span key={i} className="text-gray-400 font-medium whitespace-nowrap flex items-center gap-2">
                <span className="text-gray-500">◆</span> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          {[
            { id: 'matches', icon: Trophy, label: 'Matches' },
            { id: 'clips', icon: Video, label: 'Clips' },
            { id: 'live', icon: Radio, label: 'Live Streams' },
            { id: 'members', icon: Users, label: 'Squad' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 font-medium transition-all border-t-2 ${
                activeTab === tab.id 
                  ? 'border-cyan-400 text-white bg-gray-800/50' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'live' && liveMembers.length > 0 && (
                <span className="bg-red-500 text-xs px-1.5 py-0.5 rounded-full">{liveMembers.length}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        
        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold">Compete in epic<br/>tournaments</h2>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-800 rounded-lg p-1">
                  {['all', 'past', 'upcoming'].map(f => (
                    <button
                      key={f}
                      onClick={() => setMatchFilter(f)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        matchFilter === f ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All matches' : f === 'past' ? 'Past matches' : 'Upcoming matches'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddMatchModal(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Match
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map(match => (
                <div key={match.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <TeamLogo team={match.team1} />
                      <div className="text-center">
                        {match.status === 'past' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{match.score1}</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-2xl font-bold">{match.score2}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-500">V</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-2xl font-bold text-gray-500">S</span>
                          </div>
                        )}
                      </div>
                      <TeamLogo team={match.team2} />
                    </div>

                    <span className={`inline-block text-xs px-2 py-1 rounded mb-3 ${
                      match.status === 'past' ? 'bg-gray-700 text-gray-300' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {match.status === 'past' ? 'Past' : 'Upcoming'}
                    </span>

                    <h3 className="font-semibold text-lg mb-2">{match.team1} vs {match.team2}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {match.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {match.time}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <a href={match.streamUrl} className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm transition-colors">
                        <Play size={16} /> Watch stream
                      </a>
                      <button onClick={() => deleteMatch(match.id)} className="p-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMatches.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Trophy size={48} className="mx-auto mb-4 opacity-50" />
                <p>No matches found.</p>
              </div>
            )}
          </div>
        )}

        {/* Clips Tab */}
        {activeTab === 'clips' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gaming Clips</h2>
              <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors">
                <Upload size={20} /> Upload Clip
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clips.map(clip => (
                <div key={clip.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all group">
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                    <Video size={48} className="text-gray-600" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={48} className="text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{clip.title}</h3>
                    <p className="text-gray-400 text-sm">{clip.game} • {clip.uploader}</p>
                    <p className="text-gray-500 text-xs mt-1">{clip.date}</p>
                    <div className="flex gap-2 mt-3">
                      <a href={clip.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-center py-2 rounded-lg text-sm transition-colors">Watch</a>
                      <button onClick={() => deleteClip(clip.id)} className="p-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition-colors">
                        <Trash2 size={16} />
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

        {/* Live Streams Tab */}
        {activeTab === 'live' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Live Streams</h2>
            {liveMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveMembers.map(member => (
                  <div key={member.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <div className="aspect-video bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center relative">
                      <Users size={64} className="text-gray-600" />
                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-2 py-1 rounded text-sm">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-cyan-400 text-sm">{member.game}</p>
                      <p className="text-gray-300 mt-2 mb-4">{member.streamTitle}</p>
                      <a href={member.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors">
                        <Twitch size={20} /> Watch on Twitch
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

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">The Squad</h2>
              <button onClick={() => setShowAddMemberModal(true)} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors">
                <Users size={20} /> Add Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map(member => (
                <div key={member.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <button onClick={() => toggleLive(member.id)} className={`text-xs px-2 py-1 rounded-full ${member.isLive ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-gray-700 text-gray-400'}`}>
                        {member.isLive ? '🔴 Live' : '⚫ Offline'}
                      </button>
                    </div>
                  </div>
                  {member.isLive && <p className="text-gray-400 text-sm mb-3">Playing: {member.game}</p>}
                  <div className="flex gap-2">
                    <a href={member.twitch} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors">
                      <Twitch size={16} /> Twitch
                    </a>
                    <button onClick={() => deleteMember(member.id)} className="p-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition-colors">
                      <Trash2 size={16} />
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
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Upload Clip</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Clip Title" value={newClip.title} onChange={e => setNewClip({...newClip, title: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <input type="text" placeholder="Game" value={newClip.game} onChange={e => setNewClip({...newClip, game: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <input type="text" placeholder="Your Name" value={newClip.uploader} onChange={e => setNewClip({...newClip, uploader: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <input type="url" placeholder="Clip URL" value={newClip.url} onChange={e => setNewClip({...newClip, url: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <button onClick={handleUploadClip} className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-lg font-semibold transition-colors">Upload Clip</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Squad Member</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Gamer Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <input type="url" placeholder="Twitch URL" value={newMember.twitch} onChange={e => setNewMember({...newMember, twitch: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <button onClick={handleAddMember} className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-lg font-semibold transition-colors">Add Member</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Match Modal */}
      {showAddMatchModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Match</h3>
              <button onClick={() => setShowAddMatchModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Team 1 Name" value={newMatch.team1} onChange={e => setNewMatch({...newMatch, team1: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <input type="text" placeholder="Team 2 Name" value={newMatch.team2} onChange={e => setNewMatch({...newMatch, team2: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <input type="text" placeholder="Date (e.g., November 15, 2024)" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <input type="text" placeholder="Time (e.g., 4:30 pm)" value={newMatch.time} onChange={e => setNewMatch({...newMatch, time: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
              <select value={newMatch.status} onChange={e => setNewMatch({...newMatch, status: e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none">
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <button onClick={handleAddMatch} className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-lg font-semibold transition-colors">Add Match</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}