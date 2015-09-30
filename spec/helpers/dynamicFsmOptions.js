/**
 * Created by Stanislav on 9/30/2015.
 */
module.exports = {
	grandparent: {
		states: {
			uninitialized: {
				start: "ready",
				letsDoThis: function() {
					this.deferUntilTransition( "ready" );
				}
			},
			ready: {
				_onEnter: function(fsm,data) {
					this.emit( "ready-OnEnterFiring" );
				},
				letsDoThis: function() {
					this.emit( "WeAreDoingThis", { someprop: "someval" } );
				},
				_onExit: function(fsm,data) {
					this.emit( "ready-OnExitFiring" );
				}
			},
			go: {
				_onEnter: function(fsm,data) {
					this.emit( "enter-data-accepted",data );
				},
				letsDoThis: function(data) {
					this.emit( "handler-data-accepted", data );
				},
				_onExit: function(fsm,data) {
					this.emit( "exit-data-accepted",data );
				}
			}
		}
	},
	parent: {
		states: {
			notQuiteDone: {
				doMoar: function() {
					this.emit( "doingMoar" );
					this.transition( "done" );
				}
			}
		}
	},
	child: {
		namespace: "specialSauceNamespace",
		states: {
			ready: {
				letsDoThis: function() {
					this.emit( "WeAreDoingThis", { someprop: "someval" } );
					this.transition( "notQuiteDone" );
				},
				canWeDoThis: function( name ) {
					return "yep, " + name + " can do it.";
				}
			},
			done: {
				_onEnter: function(fsm,data) {
					this.emit( "done-OnEnterFiring" );
				}
			}
		}
	}
};
