import React, { useEffect, useState } from 'react'
import { usePlayer } from '../Context/Context'
import { useSleep } from '../Context/AutoSleepContext'

function Sleep() {
  const { setIsPlaying } = usePlayer()
  const { time, setTime } = useSleep()
  const [rangeValue, setRangeValue] = useState(time / 60000 || 1) // Initial value in minutes or 1 minute default
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [remainingTime, setRemainingTime] = useState(time / 1000 || 0) // Initialize in seconds

  // Manage sleep timeout and countdown
  useEffect(() => {
    if (time > 0) {
      setRemainingTime(time / 1000) // Set initial remaining time in seconds
      const timer = setTimeout(() => {
        setIsPlaying(false)
        setRemainingTime(0)
        setTime(0)
        setRangeValue(1)
      }, time)

      // Start countdown
      const countdownInterval = setInterval(() => {
        setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)

      return () => {
        clearTimeout(timer)
        clearInterval(countdownInterval)
      }
    }
  }, [time, setIsPlaying])

  // Toggle modal visibility
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen)
  }

  // Update sleep time and close modal
  const handleTimeOut = () => {
    const newTime = rangeValue * 60000 // Convert minutes to milliseconds
    setTime(newTime)
    setRemainingTime(newTime / 1000) // Set remaining time in seconds
    setIsModalOpen(false) // Close the modal
  }

  // Format remaining time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}m ${secs}s`
  }

  return (
    <>
      <button 
        onClick={handleModalToggle}
        className="mt-3 block text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none rounded-xl text-sm px-4 py-1.5 text-center dark:bg-zinc-700 dark:hover:bg-zinc-900" 
        type="button"
      >
        <i className="fa-regular fa-clock"></i>
      </button>

      {/* Display Remaining Time */}
      {remainingTime > 0 && (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
          Time remaining: {formatTime(remainingTime)}
        </p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Auto Sleep Settings</h3>
                <button
                  onClick={handleModalToggle}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 md:p-5 space-y-4">
                <label htmlFor="sleep-time" className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                  Sleep Timer: {rangeValue} min
                </label>
                <input
                  type="range"
                  id="sleep-time"
                  min="0" // Minimum value is 1 minute
                  max="60" // Maximum value is 160 minutes
                  value={rangeValue} // Bind rangeValue to the input
                  onChange={(e) => setRangeValue(Number(e.target.value))} // Update rangeValue state
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Adjust the sleep timer to automatically pause after the specified time.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={handleTimeOut}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
                <button
                  onClick={handleModalToggle}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sleep
