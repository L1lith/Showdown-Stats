window.addEventListener('load', ()=>{
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL('/build.js'))
  document.body.appendChild(script)
})
