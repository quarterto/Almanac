import React, {Component} from 'react';
import {setsCampaign, withCampaign, withCampaignData} from '../data/campaign';
import Icon from '../visual/icon';
import styled, {css} from 'styled-components';
import PropTypes from 'prop-types';
import Link from '../control/link';
import {withTracker} from 'meteor/react-meteor-data';
import {H3} from '../visual/heading';
import {Campaigns} from '../../../shared/imports/collections';
import {compose, withContext, withState, lifecycle, getContext} from 'recompact';
import {withUserData, logout} from '../utils/logged-in';
import Logo from '../visual/logo';
import Grid from '../visual/grid';
import Title from '../utils/title';
import User from '../document/user';
import {iAmOwner} from '../data/owner';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const LogoutButton = withUserData(({user}) => user
	? <User user={user} component={MenuLink} onClick={logout} href='/logout' />
	: null
);

const Toolbar = styled.nav`
	display: flex;
	border-bottom: 1px solid rgba(0,0,0,0.1);
`;

export const MenuLink = styled(Link)`
	display: block;
	padding: 1rem;
	color: black;
	text-decoration: none;

	.ra {
		margin-right: 0.25em;
		vertical-align: -1px;
	}

	&:hover {
		background: rgba(0,0,0,0.05);
	}

	&:active {
		background: rgba(0,0,0,0.1);
	}

	${Logo} {
		margin: -0.3rem 0;
	}
`;

const Divider = styled.div`
	padding: 0.5em 0;

	&::after {
		display: block;
		content: '';
		width: 1px;
		height: 100%;
		background: rgba(0,0,0,0.1);
	}
`;

const Space = styled.div`
	flex: 1;
`;

const NavArea = styled.div`
	flex: 1;
	display: flex;
`;

const MenuTitle = styled(H3)`
	display: inline-block;
	margin: 0;
	vertical-align: -1px;
	white-space: nowrap;
`;

const CampaignTitle = ({campaign}) => <MenuLink href={`/${campaign._id}`}>
	<MenuTitle>
		{campaign.title}
	</MenuTitle>
</MenuLink>;

const connectNav = compose(
	withCampaignData,
	iAmOwner('campaign'),
	withUserData
);

const Nav = connectNav(({user, campaignId, campaign, isOwner, extraItems}) => <Toolbar>
	<NavArea>
		<MenuLink href={`/`}>
			<Logo />
		</MenuLink>

		{campaignId && <>
			<Divider />
			<CampaignTitle campaign={campaign} />

			{isOwner && <>
				<MenuLink href={`/${campaignId}/dashboard-control`}>
					<Icon icon='wooden-sign' />
					Dashboard
				</MenuLink>

				<MenuLink href={`/${campaignId}/players`}>
					<Icon icon='double-team' />
					Players
				</MenuLink>

				<MenuLink href={`/${campaignId}/settings`}>
					<Icon icon='gears' />
					Settings
				</MenuLink>
			</>}

		</>}
	</NavArea>


	<NavArea>
		<Space />
		{extraItems}
		<LogoutButton />
	</NavArea>
</Toolbar>);

const navContext = {
	setExtraNavItems: PropTypes.func,
	setNavShown: PropTypes.func,
};

export const withNavContext = getContext(navContext);

const navState = withState('state', 'setState', {
	extraItems: [],
	navShown: true,
});

const setNavContext = withContext(
	navContext,
	({setState, state}) => ({
		setExtraNavItems(...extraItems) {
			setState({
				...state,
				extraItems,
			})
		},

		setNavShown(navShown = true) {
			setState({
				...state,
				navShown,
			})
		},
	})
);

export const hidesNav = compose(
	withNavContext,
	lifecycle({
		componentDidMount() {
			this.props.setNavShown(false);
		},

		componentWillUnmount() {
			this.props.setNavShown(true);
		},
	})
);

export const withExtraNavItems = (...navItems) => compose(
	withNavContext,
	lifecycle({
		componentDidMount() {
			this.props.setExtraNavItems(...navItems.map(
				(NavItem, i) => <NavItem {...this.props} key={i} />
			));
		},

		componentWillUnmount() {
			this.props.setExtraNavItems();
		},
	})
);

const connectLayout = compose(
	navState,
	setNavContext
);

export const Basic = setsCampaign(({children}) => <>
	<Title />
	<ToastContainer autoClose={10000} />
	{children}
</>);

const Layout = connectLayout(({campaignId, secret, state, children}) =>
	<Basic campaignId={campaignId} secret={secret}>
		{state.navShown &&
			<Nav extraItems={state.extraItems} />
		}

		<Grid>
			{children}
		</Grid>
	</Basic>
);

export default Layout;