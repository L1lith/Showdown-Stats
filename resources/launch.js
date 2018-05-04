window.addEventListener('load', ()=>{
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL('/build.js'))
  document.head.appendChild(script)
  const font = document.createElement('link')
  font.href = "https://fonts.googleapis.com/css?family=Open+Sans"
  font.rel = "stylesheet"
  document.head.appendChild(font)
})
