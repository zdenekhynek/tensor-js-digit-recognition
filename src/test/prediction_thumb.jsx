import React from 'react';

import classes from './prediction_thumb.css';

export default function({ imagePath, number }) {
	const formattedNumber = number / 100;

	return (
		<div className={classes.thumb}>
			<div className={classes.imageWrap}>
				<img className={classes.image} src={imagePath} />
			</div>
			<div className={classes.number}>{formattedNumber.toFixed(2)}</div>
		</div>
	);
};