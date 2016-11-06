module.exports = (message, volume) => {
  if ('SpeechSynthesisUtterance' in window) {
    const synthes = new window.SpeechSynthesisUtterance()
    synthes.text = message
    synthes.lang = 'en-GB'
    synthes.volume = volume
    window.speechSynthesis.speak(synthes)
  }
}
