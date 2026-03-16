"use client";
import { useStore } from "./context/StoreContext";
import BeatItem from "./components/BeatItem";

export default function Home() {
  const {
    filteredBeats,
    searchQuery, setSearchQuery,
    selectedTag, setSelectedTag,
    allTags,
    isLoading,
    fetchError,
  } = useStore();

  return (
    <main className="main-content" id="main">

      <div className="beat-list-header fade-in visible">
        <p>Beats <span>· {filteredBeats.length} tracks</span></p>
      </div>

      <div className="filters-section fade-in visible">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search beats, artists..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tags-container">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${selectedTag === tag ? "active" : ""}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="beat-list">

        {isLoading && (
          <div className="no-results">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading beats...</p>
          </div>
        )}

        {!isLoading && fetchError && (
          <div className="no-results">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Could not load beats. Please try again later.</p>
          </div>
        )}

        {!isLoading && !fetchError && filteredBeats.length === 0 && (
          <div className="no-results">
            <i className="fas fa-ghost"></i>
            <p>No beats found.</p>
          </div>
        )}

        {!isLoading && !fetchError &&
          filteredBeats.map((beat) => (
            <BeatItem key={beat.id} beat={beat} />
          ))}
      </div>
    </main>
  );
}