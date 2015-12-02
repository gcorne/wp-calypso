const FEED_URL_BASE = '/read/blog/feed/';
const SITE_URL_BASE = '/read/blog/id/';

const PRETTY_FEED_URLS = {
	12733228: '/discover'
};

const PRETTY_SITE_URLS = {
	53424024: '/discover'
}

export function getSiteUrl( siteID ) {
	return PRETTY_SITE_URLS[ siteID ] || SITE_URL_BASE + siteID;
}

export function getFeedUrl( feedID ) {
	return PRETTY_FEED_URLS[ feedID ] || FEED_URL_BASE + feedID;
}

export function getStreamUrlFromPost( post ) {
	if ( post.feed_ID ) {
		return getFeedUrl( post.feed_ID );
	}

	return getSiteUrl( post.site_ID );
}