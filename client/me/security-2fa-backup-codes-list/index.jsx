/**
 * External dependencies
 */
var React = require( 'react' ),
	debug = require( 'debug' )( 'calypso:me:security:2fa-backup-codes-list' );

/**
 * Internal dependencies
 */
var	FormButton = require( 'components/forms/form-button' ),
	analytics = require( 'analytics' ),
	FormButtonBar = require( 'components/forms/form-buttons-bar' ),
	FormCheckbox = require( 'components/forms/form-checkbox' ),
	FormLabel = require( 'components/forms/form-label' ),
	Notice = require( 'components/notice' );

module.exports = React.createClass( {

	displayName: 'Security2faBackupCodesList',

	popup: false,

	componentDidMount: function() {
		debug( this.constructor.displayName + ' React component is mounted.' );
	},

	componentWillUnmount: function() {
		debug( this.constructor.displayName + ' React component will unmount.' );
	},

	getDefaultProps: function() {
		return {
			backupCodes: []
		};
	},

	propTypes: {
		onNextStep: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			userAgrees: false
		};
	},

	openPopup: function() {
		this.popup = window.open();

		if ( null === this.popup ) {
			this.setState(
				{
					lastError: this.translate( 'Please disable your pop-up blocker and try again.' )
				}
			);
			return false;
		}

		this.setState( { lastError: false } );
		return true;
	},

	onPrint: function( event ) {
		event.preventDefault();
		if ( this.openPopup() ) {
			this.doPopup( this.props.backupCodes );
		}
	},

	doPopup: function( codes ) {
		var datePrinted = this.moment().format( 'MMM DD, YYYY @ h:mm a' );
		var row;

		this.popup.document.open( 'text/html' );
		this.popup.document.write( '<html><body style="font-family:sans-serif">' );
		this.popup.document.write( '<div style="padding:10px; border:1px dashed black; display:inline-block">' );
		this.popup.document.write(
			'<p style="margin-top:0"><strong>' +
			this.translate( 'Backup verification codes' ) +
			'</strong></p>'
		);

		this.popup.document.write( '<table style="border-spacing:30px 5px">' );
		this.popup.document.write( '<tbody>' );

		for ( row = 0; row < 5; row++ ) {
			this.popup.document.write(
				'<tr>' +
				'<td>' + ( row + 1 ) + '. ' +
				'<strong>' + codes[ row * 2 ] + '</strong>' +
				'</td>' +
				'<td>' + ( row + 6 ) + '. ' +
				'<strong>' + codes[ row * 2 + 1 ] + '</strong>' +
				'</td>' +
				'</tr>'
			);
		}

		this.popup.document.write( '</tbody></table>' );

		this.popup.document.write(
			'<p style="margin-bottom:0">' +
			this.translate(
				'Printed: %(datePrinted)s',
				{
					args: {
						datePrinted: datePrinted
					}
				}
			) +
			'</p>'
		);

		this.popup.document.write( '</div></body></html>' );

		this.popup.document.close();
		this.popup.print();

		/* this code takes advantage of setTimeout not running until after the
		print dialog is dismissed - it is more reliable than using focus tricks */
		setTimeout( function() {
			this.popup.close();
			this.popup = false;
		}.bind( this ), 100 );
	},

	onNextStep: function( event ) {
		event.preventDefault();
		this.props.onNextStep();
	},

	getPlaceholders: function() {
		var i,
			placeholders = [];

		for ( i = 0; i < 10; i++ ) {
			placeholders.push( ' ' );
		}

		return placeholders;
	},

	onUserAgreesChange: function( event ) {
		this.setState( { userAgrees: event.target.checked } );
	},

	getSubmitDisabled: function() {
		return ! this.state.userAgrees;
	},

	renderList: function() {
		var backupCodes = this.props.backupCodes.length ? this.props.backupCodes : this.getPlaceholders();

		return (
			<div>
				<p>
					{
						this.translate(
							'We ask that you print this list of ten unique, ' +
							'one-time-use backup codes and keep the list in a safe place.'
						)
					}
				</p>
				<ol className="security-2fa-backup-codes-list__codes">
					{ backupCodes.map( function( backupCode, index ) {
						var spacedCode = backupCode.concat( ' ' );
						// we add a space to each backup code so that if the user wants to copy and paste the entire list
						// the backup codes aren't placed in the clipboard as a single long number
						return (
							<li key={ index } className={ this.props.backupCodes.length ? null : 'is-placeholder' } >
								<span>
									{ spacedCode }
								</span>
							</li>
						);
					}, this ) }
				</ol>

				<p className="security-2fa-backup-codes-list__warning">
					<span className="noticon noticon-warning"></span>
					{ this.translate( 'Without access to the app, your phone, or a backup code, you will lose access to your account.' ) }
				</p>

				{ this.possiblyRenderError() }

				<FormButtonBar>
					<FormLabel className="security-2fa-backup-codes-list__print-agreement">
						<FormCheckbox
							defaultChecked={ this.state.userAgrees }
							onChange={ this.onUserAgreesChange }
						/>
						{ this.translate( 'I have printed or saved these codes', { context: 'The codes are the backup codes for Two-Step Authentication.' } ) }
					</FormLabel>

					<FormButton
						className="security-2fa-backup-codes-list__next"
						onClick={ function( event ) {
							analytics.ga.recordEvent( 'Me', 'Clicked On 2fa Backup Codes Next Step Button' );
							this.onNextStep( event );
						}.bind( this ) }
						disabled={ this.getSubmitDisabled() }
					>
						{ this.translate( 'All Finished!', { context: 'The user presses the All Finished button at the end of Two-Step setup.' } ) }
					</FormButton>

					<FormButton
						className="security-2fa-backup-codes-list__print"
						isPrimary={ false }
						onClick={ function( event ) {
							analytics.ga.recordEvent( 'Me', 'Clicked On 2fa Print Backup Codes Button' );
							this.onPrint( event );
						}.bind( this ) }
					>
						{ this.translate( 'Print', { context: 'The user presses the print button during Two-Step setup to print their backup codes.' } ) }
					</FormButton>
				</FormButtonBar>
			</div>
		);
	},

	clearLastError: function() {
		this.setState( { lastError: false } );
	},

	possiblyRenderError: function() {
		if ( ! this.state.lastError ) {
			return null;
		}

		return (
			<Notice
				isCompact
				status="is-error"
				onClick={ this.clearLastError }
				text={ this.state.lastError }
			/>
		);
	},

	render: function() {
		return (
			<div className="security-2fa-backup-codes-list">
				{ this.renderList() }
			</div>
		);
	}
} );
