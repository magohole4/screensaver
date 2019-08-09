chrome.app.runtime.onLaunched.addListener(newWindow);
function newWindow() {
  chrome.app.window.create('index.html', {
    frame: 'true',
    id: 'main',
    bounds: {width: 620, height: 500}
    // state: "fullscren"
  });
  // chrome.app.window.create('index.html', {state: "fullscren"});
}
