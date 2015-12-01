/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import DownloadLink from './download-link';

export default React.createClass( {
	propTypes: {
		isComplete: PropTypes.bool.isRequired,
		isFailed: PropTypes.bool.isRequired,
		downloadURL: PropTypes.string,
		downloadFilename: PropTypes.string,
		failureReason: PropTypes.string
	},

	render() {
		if ( this.props.isComplete ) {
			return (
				<CompactCard>
					<h1 className="exporter__download-heading">
						{ this.translate( 'Your Export was Successful!' ) }
					</h1>
					<p className="exporter__download-label">
						{ this.translate( 'Download your export file here:' ) }
					</p>
					<DownloadLink
						downloadURL={ this.props.downloadURL }
						downloadFilename={ this.props.downloadFilename } />
				</CompactCard>
			);
		}

		if ( this.props.isFailed ) {
			return (
				<CompactCard>
					<h1 className="exporter__download-heading">
						{ this.translate( 'Oops! There was a problem creating your export file' ) }
					</h1>
					<p className="exporter__failure-reason">
						{ this.props.failureReason }
					</p>
				</CompactCard>
			)
		}

		return null;
	}
} );
