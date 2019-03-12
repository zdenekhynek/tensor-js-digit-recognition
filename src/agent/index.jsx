import React from 'react';

import classes from './agent.css';

function renderCursor() {
	return (<span className={classes.blinkingCursor}>|</span>);
}

export default function({ msg = 'Processing' }) {
	return (
		<div className={classes.agent}>
			<span className={classes.icon} />
			<p className={classes.msg}>{msg}{renderCursor()}</p>
		</div>
	);
}	