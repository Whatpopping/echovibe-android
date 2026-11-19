import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Search, Home, Music, Radio, Library, Heart, MoreHorizontal, Shuffle, Repeat, AlertCircle } from 'lucide-react';

const EchoVibeApp = () => {
  const [currentPage, setCurrentPage] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  const featuredPlaylists = [
    { id: 1, name: "Today's Top Hits", description: "The biggest songs right now", tracks: 50 },
    { id: 2, name: "Chill Vibes", description: "Relax and unwind", tracks: 30 },
    { id: 3, name: "Workout Mix", description: "High energy tracks", tracks: 40 },
    { id: 4, name: "Indie Discoveries", description: "Fresh indie music", tracks: 25 },
  ];

  const trendingTracks = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", plays: "1.2B" },
    { id: 2, title: "Levitating", artist: "Dua Lipa", duration: "3:23", plays: "800M" },
    { id: 3, title: "Good 4 U", artist: "Olivia Rodrigo", duration: "2:58", plays: "600M" },
    { id: 4, title: "Stay", artist: "The Kid LAROI & Justin Bieber", duration: "2:21", plays: "900M" },
    { id: 5, title: "Heat Waves", artist: "Glass Animals", duration: "3:58", plays: "1.5B" },
  ];

  const searchYouTube = useCallback(async (query) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockResults = [
        { id: Date.now() + 1, title: `${query} - Official Music Video`, artist: "Artist Name", duration: "3:45", thumbnail: "https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=♪" },
        { id: Date.now() + 2, title: `${query} (Lyrics)`, artist: "Various Artists", duration: "3:12", thumbnail: "https://via.placeholder.com/60x60/EC4899/FFFFFF?text=♪" },
        { id: Date.now() + 3, title: `${query} - Acoustic Version`, artist: "Cover Artist", duration: "3:30", thumbnail: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=♪" },
        { id: Date.now() + 4, title: `${query} - Remix`, artist: "DJ Remix", duration: "4:15", thumbnail: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=♪" },
      ];
      setSearchResults(mockResults);
    } catch (err) {
      setError("Failed to search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playTrack = useCallback((track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setQueue(prev => [track, ...prev.filter(t => t.id !== track.id)]);
    setRecentlyPlayed(prev => [track, ...prev.filter(t => t.id !== track.id)].slice(0, 10));
    setError(null);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleLike = useCallback((track) => {
    setLikedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(track.id)) {
        newSet.delete(track.id);
      } else {
        newSet.add(track.id);
      }
      return newSet;
    });
  }, []);

  const skipTrack = useCallback((direction) => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < queue.length) {
      playTrack(queue[nextIndex]);
    }
  }, [currentTrack, queue, playTrack]);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying, currentTrack]);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      searchYouTube(searchTerm);
      setCurrentPage('search');
    }
  }, [searchTerm, searchYouTube]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const TrackItem = ({ track, showArtist = true, onPlay }) => (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-lg transition-colors group">
      <div className="relative">
        <img 
          src={track.thumbnail || "https://via.placeholder.com/48x48/8B5CF6/FFFFFF?text=♪"} 
          alt={track.title}
          className="w-12 h-12 rounded object-cover"
        />
        <button
          onClick={() => onPlay(track)}
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={16} className="text-white" />
        </button>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{track.title}</div>
        {showArtist && <div className="text-gray-400 text-sm truncate">{track.artist}</div>}
      </div>
      
      <div className="text-gray-400 text-sm">{track.duration}</div>
      
      <button
        onClick={() => toggleLike(track)}
        className={`p-1 rounded transition-colors ${likedSongs.has(track.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
      >
        <Heart size={16} fill={likedSongs.has(track.id) ? 'currentColor' : 'none'} />
      </button>
    </div>
  );

  const DiscoverPage = () => (
    <div className="space-y-8 pb-24">
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
        <div className="grid grid-cols-2 gap-4">
          {featuredPlaylists.map(playlist => (
            <div key={playlist.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-full h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-2 flex items-center justify-center">
                <Music size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{playlist.name}</h3>
              <p className="text-gray-400 text-xs">{playlist.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="space-y-2">
          {trendingTracks.map(track => (
            <TrackItem key={track.id} track={track} onPlay={playTrack} />
          ))}
        </div>
      </section>
      
      {recentlyPlayed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
          <div className="space-y-2">
            {recentlyPlayed.map(track => (
              <TrackItem key={`recent-${track.id}`} track={track} onPlay={playTrack} />
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const SearchPage = () => (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold">Search Results for "{searchTerm}"</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-2">
          {searchResults.map(track => (
            <TrackItem key={track.id} track={track} onPlay={playTrack} />
          ))}
        </div>
      )}
    </div>
  );

  const LibraryPage = () => (
    <div className="space-y-8 pb-24">
      <section>
        <h2 className="text-2xl font-bold mb-6">Liked Songs</h2>
        {Array.from(likedSongs).length === 0 ? (
          <p className="text-gray-400">No liked songs yet. Start exploring and like some tracks!</p>
        ) : (
          <div className="space-y-2">
            {trendingTracks.filter(track => likedSongs.has(track.id)).map(track => (
              <TrackItem key={track.id} track={track} onPlay={playTrack} />
            ))}
          </div>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-4xl mb-2">+</div>
              <p className="text-gray-400">Create Playlist</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const MusicPlayer = () => {
    if (!currentTrack) return null;
    
    return (
      <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-r from-gray-900 to-black text-white p-3 border-t border-gray-800 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img 
              src={currentTrack.thumbnail || "https://via.placeholder.com/48x48/8B5CF6/FFFFFF?text=♪"} 
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{currentTrack.title}</div>
              <div className="text-gray-400 text-xs truncate">{currentTrack.artist}</div>
            </div>
            <button
              onClick={() => toggleLike(currentTrack)}
              className={`p-1 rounded transition-colors ${likedSongs.has(currentTrack.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={14} fill={likedSongs.has(currentTrack.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button onClick={() => skipTrack('previous')} className="p-2 hover:bg-gray-800 rounded-full">
              <SkipBack size={16} />
            </button>
            <button onClick={togglePlayPause} className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full">
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={() => skipTrack('next')} className="p-2 hover:bg-gray-800 rounded-full">
              <SkipForward size={16} />
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <Volume2 size={14} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-16 accent-purple-500"
            />
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
          <div 
            className="bg-purple-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <audio ref={audioRef} />
      </div>
    );
  };

  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm text-white p-2 flex justify-around border-t border-gray-800 z-30">
      <button onClick={() => setCurrentPage('discover')} className={`flex flex-col items-center p-2 rounded ${currentPage === 'discover' ? 'text-purple-400' : 'text-gray-400'}`}>
        <Home size={20} />
        <span className="text-xs">Discover</span>
      </button>
      <button onClick={() => setCurrentPage('browse')} className={`flex flex-col items-center p-2 rounded ${currentPage === 'browse' ? 'text-purple-400' : 'text-gray-400'}`}>
        <Music size={20} />
        <span className="text-xs">Browse</span>
      </button>
      <button onClick={() => setCurrentPage('radio')} className={`flex flex-col items-center p-2 rounded ${currentPage === 'radio' ? 'text-purple-400' : 'text-gray-400'}`}>
        <Radio size={20} />
        <span className="text-xs">Radio</span>
      </button>
      <button onClick={() => setCurrentPage('library')} className={`flex flex-col items-center p-2 rounded ${currentPage === 'library' ? 'text-purple-400' : 'text-gray-400'}`}>
        <Library size={20} />
        <span className="text-xs">Library</span>
      </button>
    </nav>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'discover':
        return <DiscoverPage />;
      case 'search':
        return <SearchPage />;
      case 'library':
        return <LibraryPage />;
      default:
        return <DiscoverPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <header className="sticky top-0 bg-black/80 backdrop-blur-sm p-4 z-10">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search songs, artists..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm"
          >
            Search
          </button>
        </div>
      </header>
      
      <main className="p-4">
        {renderCurrentPage()}
      </main>
      
      <MusicPlayer />
      <BottomNav />
    </div>
  );
};

export default EchoVibeApp;
