import React from 'react';
import './css/App.css';
import Opportunity from './components/Opportunities';

import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
	render() {
		return (
			<div className='body'>
				<Opportunity />
			</div>
		);
	}
}

export default App;
