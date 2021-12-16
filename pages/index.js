import { useState, useCallback } from 'react'
import throttle from 'lodash.throttle'
import axios from 'axios'
import { useRouter } from 'next/router'

import styles from '../styles/SongSearch.module.css'
import CenterContainer from '../components/CenterContainer'
import StyledButton from '../components/StyledButton'
import Modal from '../components/Modal'
import Link from 'next/link'


const SongSearch = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [modalOpen, setModalOpen] = useState(true)
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false)

  const routeTo = (href) => {
    router.push(href)
  }

  const [searchResults, setSearchResults] = useState([])
  const getAndSetSearchResults = useCallback(throttle((value) => {
    /* eslint react-hooks/exhaustive-deps: 0 */
    if (value) {
      axios.post('/api/spotify/search', { query: value })
        .then((results) => {
          setSearchResults(results.data)
        })
    }
  }, 500), [])

  const [inputValue, setInputValue] = useState('')
  const handleKeystrokes = (event) => {
    const { value } = event.target
    setInputValue(value)
    getAndSetSearchResults(value)
  }

  const [selectedSongs, setSelectedSongs] = useState([])
  const handleAdd = (songObj) => {
    const hasDuplicate = selectedSongs.find(aSongObj => aSongObj.id === songObj.id)
    if (hasDuplicate) return

    setInputValue('')
    setSearchResults([])
    setSelectedSongs([...selectedSongs, songObj])
  }

  const handleRemove = (songId) => {
    setSelectedSongs(selectedSongs.filter(aSongObj => aSongObj.id !== songId))
  }

  const handleSubmit = async () => {
    if (hasSubmittedOnce) return
    console.log('submitting your list of songs to the server!')
    const selectedSongIds = selectedSongs.map(songObj => songObj.id)
    console.log({ songIDs: selectedSongIds, username: name })
    const res = await axios.post('/api/create', { songIDs: selectedSongIds, username: name })
    setHasSubmittedOnce(true)
    const data = await res.data
    routeTo(`/share/${data.slug}`)
  }

  const renderSelectedSong = (songObj, index) => (
    <div key={songObj.id} className={styles.resultcontainer}>
      <span className={styles.result}>
        {index + 1}. {songObj.name}<br />
        <span className={styles.artist}>{songObj.artist}</span>
      </span>
      <button className={styles.rmvbtn} onClick={() => handleRemove(songObj.id)}>
        -
      </button>
    </div>
  )

  return (
    <>
      <CenterContainer greyBorder homepage>
        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
              <p>Welcome to WrapBattle<br /><br />
                  As the speaker it is your job to create a memory your guests will never forget, your Spotify Wrapped.
                  <br />
                  <br />
                  Rules:
                  <br />
                  - Enter your top 5 songs from Wrapped
                  <br />
                  - Enter five more songs to mix people up
                  <br />
                  - Share your link on Twitter or directly, and see how your friends do guessing your top 5
              </p>
          </Modal>
        )}

        <div className={styles.infocontainer}>
          <div className={styles.info} onClick={() => setModalOpen(true)}>i</div>
          <Link href="/" passHref>
              <a className={styles.title}>
                🎶&nbsp;&nbsp;SPOTIFY WRAPBATTLE ⚔️
              </a>
          </Link>
        </div>


        <h1 className={styles.header}>What should we call You?</h1>
        <input
          className={styles.input}
          placeholder="Your Name"
          value={name}
          onChange={event => setName(event.target.value)}
        />

        <h1 className={styles.header}>Enter Your <span style={{ color: "#1DB954" }}>Top 5</span> Songs</h1>

        {selectedSongs.slice(0, 5).map(renderSelectedSong)}

        {selectedSongs.length >= 5 && (
          <h1>Enter 5 <span style={{ color: "#1DB954" }}>Misleading</span> Songs</h1>
        )}

        {selectedSongs.slice(5).map(renderSelectedSong)}

        {selectedSongs.length < 10 && (
          <input
            className={styles.input}
            placeholder="search for a song..."
            value={inputValue}
            onChange={handleKeystrokes}
          />
        )}

        {searchResults.map((result) => (
          <div key={result.id} className={styles.resultcontainer}>
            <span className={styles.result}>
              {result.name}<br />
              <span className={styles.artist}>{result.artist}</span>
            </span>
            <button className={styles.addbtn} onClick={() => handleAdd(result)}>
              +
            </button>
          </div>
        ))}

        {selectedSongs.length >= 10 && (
          <StyledButton style={{ marginTop: '16px' }} onClick={handleSubmit}>
            Create my WrapBattle!
          </StyledButton>
        )}

        <div style={{ width: '1px', height: '1px', marginBotton: '100px' }} />


      </CenterContainer>
      <div className={styles.footer}>
        Made by&nbsp;
        <a className={styles.link} href="https://www.bramadams.dev/" target="_blank" rel="noreferrer">Bram</a>
        &nbsp;&&nbsp;
        <a className={styles.link} href="https://www.benzenker.me/" target="_blank" rel="noreferrer">Ben</a>
      </div>
    </>
  );
};

export default SongSearch;
