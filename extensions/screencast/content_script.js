const recordingKey = '__browserless_recording__';

window.onload = () => {
  if (window[recordingKey]) {
    return null;
  }

  Object.defineProperty(window, recordingKey, { value: true, writable: false });

  const port = chrome.runtime.connect(chrome.runtime.id);
  port.onMessage.addListener((msg) => window.postMessage(msg, '*'));

  window.addEventListener('message', event => {
    // Relay client messages
    if (event.source === window && event.data.type) {
      port.postMessage(event.data);
    }

    if (event.data.filename) {
      document.querySelector('html').setAttribute('data-filepath', event.data.filename);
    }

    if (event.data.downloadComplete) {
      document.querySelector('html').classList.add('downloadComplete');
    }
  });

  document.title = 'browserless-screencast';
};
