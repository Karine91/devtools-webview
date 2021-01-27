import React, { useRef, useEffect } from 'react';
import { remote } from 'electron';
import fetch from 'node-fetch';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import './App.global.css';


const Hello = () => {
	const devtools = useRef(null);
	const browser = useRef(null);

	const getDevUrls = async () => {
		const baseUrl = 'http://127.0.0.1:8222';
		const res = await fetch(`${baseUrl}/json`);
		if (res.status === 200) {
			const data = await res.json();
			console.log(data);
			const target = data.find(child => child.type === 'webview' && child.url === browser.current.src);
			if (target) {
				devtools.current.src = `${baseUrl}${target.devtoolsFrontendUrl}`;
			}
		}
		
	}

	const emittedOnce = (element, eventName) => new Promise(resolve => {
		element.addEventListener(eventName, event => resolve(event), { once: true })
	  })

	useEffect(() => {
		if (browser.current) {
			
			emittedOnce(browser.current, 'dom-ready').then(() => {
				//browser.current.openDevTools()
				getDevUrls();
			});
		}
	}, []);

	

  return (
    <div style={{ display: 'flex', width: '100%', padding: '20px', margin: '20px' }}>
	  <webview
		  id="browser"
		  ref={browser}
		  src="https://www.github.com/"
		  webpreferences="contextIsolation; webviewTag=no; devTools;"
		  preload={`file://${remote.app.getAppPath()}/preload.js`}
		  style={{
			  width: '50%',
			  height: '800px'
		  }}
		 
	  />
	  <webview 
		  id="devtools"
		  ref={devtools}
		  webpreferences="devTools=false"
		  style={{
			width: '50%',
			height: '800px'
		}}
	  />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
