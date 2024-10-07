import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import '../App.css'

const AudioPlayer = () => {
  // State to manage the EQ values
  const [bass, setBass] = useState(0);    // Low frequencies
  const [mid, setMid] = useState(0);      // Mid frequencies
  const [treble, setTreble] = useState(0); // High frequencies

  // Tone.js references
  const [player, setPlayer] = useState(null);
  const [eq, setEq] = useState(null);

  useEffect(() => {
    // Initialize Tone.Player and EQ
    const player = new Tone.Player({
      url: "https://aac.saavncdn.com/214/83fc76a7e243d7e93dfe699e5fb9fbbe_160.mp4",
      autostart: false,  // Start playback manually
    }).toDestination();

    // EQ3 allows you to control bass (low), mid, and treble (high)
    const eq = new Tone.EQ3({
      low: bass,
      mid: mid,
      high: treble,
    }).toDestination();

    // Connect the player to the EQ
    player.connect(eq);

    // Store the player and eq in the state
    setPlayer(player);
    setEq(eq);

    // Cleanup on component unmount
    return () => {
      player.dispose();
      eq.dispose();
    };
  }, []);

  // Update EQ values when sliders change
  useEffect(() => {
    if (eq) {
      eq.low.value = bass;
      eq.mid.value = mid;
      eq.high.value = treble;
    }
  }, [bass, mid, treble, eq]);

  const startPlayback = async () => {
    // Start Tone.js context and playback
    await Tone.start();
    player.start();
  };

  const stopPlayback = () => {
    if (player) {
      player.stop();
    }
  };
  const reset = () => {
    if (player) {
      player.stop();
    }
    setBass(0);
    setMid(0);
    setTreble(0);
    setPlayer(null);
    setEq(null);
    Tone.context.close();  // Close the Tone.js context to free up resources
  }

  return (
    <div className="audio-player">
      <h1>React Audio Player with Tone.js</h1>

      <div>
        <button onClick={startPlayback}>Play</button>
        <button onClick={stopPlayback}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>

    <div className="flex  items-center justify-center bg-zinc-700 w-80 h-1/3">
      <div className="Slider">
	         <input className="level" type="range" min="-40" max="10"   value={bass} onChange={(e) => setBass(Number(e.target.value))} />
      </div>
      <div className="Slider">
	         <input className="level" type="range" min="-40" max="10"   value={mid} onChange={(e) => setMid(Number(e.target.value))} />
      </div>

      <div className="Slider">
	         <input className="level" type="range" min="-40" max="10"   value={treble} onChange={(e) => setTreble(Number(e.target.value))} />
      </div>
      


      
    </div>
    </div>
  );
};

export default AudioPlayer;
