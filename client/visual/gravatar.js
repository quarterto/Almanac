import React from 'react';
import crypto from 'crypto';
import url from 'url';
import styled from 'styled-components';

const Gravatar = styled.img`
	border-radius: 100%;
	vertical-align: -.2em;
	height: 2em;
	width: 2em;
	margin: -0.5em 0.5em -0.5em 0;
`;

const gravatarHash = email => crypto.createHash('md5').update(
	email.trim().toLowerCase()
).digest('hex');

const formatGravatarUrl = email => url.format({
	scheme: 'https',
	host: 'www.gravatar.com',
	pathname: `/avatar/${gravatarHash(email)}`,
});

export default ({email, ...props}) => <Gravatar src={formatGravatarUrl(email)} alt={email} {...props} />