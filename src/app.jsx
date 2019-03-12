import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Agent from './agent';
import Generate from './generate';
import Train from './train';
import Test from './test';

import './global.css';
import classes from './app.css';

class App extends React.Component {
	constructor(props) {
		super(props);


		this.state = { agentMsg: '' };
		this.onAgentUpdate = this.onAgentUpdate.bind(this);
	}

	onAgentUpdate(agentMsg) {
		this.setState({ agentMsg });
	}

	render() {
		const { agentMsg } = this.state;
		
		return (
			<Router>
				<div className={classes.app}>
					<Agent msg={agentMsg} />
					<Route path="/generate" render={() => <Generate onAgentUpdate={this.onAgentUpdate} />} />
					<Route path="/train" render={() => <Train onAgentUpdate={this.onAgentUpdate} />} />
					<Route path="/test" render={() => <Test onAgentUpdate={this.onAgentUpdate} />} />
				</div>
			</Router>
			
		);
	}
}

export default App;