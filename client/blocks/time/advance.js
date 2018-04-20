import React from 'react';
import withTimer from '../../utils/timer';
import {withCampaignSession} from '../../data/campaign';
import {withState, withHandlers, withProps, compose} from 'recompose';
import withIncrement from './connect/increment';

const connectAdvanceTime = compose(
	withState('enabled', 'setEnabled', false),
	withCampaignSession,
	withProps({amount: 60}),
	withIncrement,
	withTimer(30000, ({enabled, onIncrement}) => enabled && onIncrement())
);

const AdvanceTime = ({enabled, setEnabled}) => <label>
	<input type="checkbox" checked={enabled} onChange={ev => setEnabled(ev.target.checked)} />
	Advance time
</label>;

export default connectAdvanceTime(AdvanceTime);