/* global DynamicFsm, _, utils, getDefaultClientMeta */
/* jshint -W098 */
/**
 * Created by Stanislav on 9/30/2015.
 */
var DynamicFsm = {
	constructor: function() {
		BehavioralFsm.apply( this, arguments );
		this.ensureClientMeta();
	},
	initClient: function initClient() {
		var initialState = this.initialState;
		if ( !initialState ) {
			throw new Error( "You must specify an initial state for this FSM" );
		}
		if ( !this.states[ initialState ] ) {
			throw new Error( "The initial state specified does not exist in the states object." );
		}
		this.transition( initialState );
	},

	handleOverload: function( client, input ) {
		var inputDef = input;
		if ( typeof input === "undefined" ) {
			throw new Error( "The input argument passed to the FSM's handle method is undefined. Did you forget to pass the input name?" );
		}
		if ( typeof input === "string" ) {
			inputDef = { inputType: input, delegated: false, ticket: undefined };
		}
		var clientMeta = this.ensureClientMeta( client );
		var args = getLeaklessArgs( arguments );
		if ( typeof input !== "object" ) {
			args.splice( 1, 1, inputDef );
		}
		clientMeta.currentActionArgs = args.slice( 1 );
		var currentState = clientMeta.state;
		var stateObj = this.states[ currentState ];
		var handlerName;
		var handler;
		var isCatchAll = false;
		var child;
		var result;
		var action;
		if ( !clientMeta.inExitHandler ) {
			child = stateObj._child && stateObj._child.instance;
			if ( child && !this.pendingDelegations[ inputDef.ticket ] && !inputDef.bubbling ) {
				inputDef.ticket = ( inputDef.ticket || utils.createUUID() );
				inputDef.delegated = true;
				this.pendingDelegations[ inputDef.ticket ] = { delegatedTo: child.namespace };
				// WARNING - returning a value from `handle` on child FSMs is not really supported.
				// If you need to return values from child FSM input handlers, use events instead.
				args.push(stateObj._data);
				result = child.handle.apply( child, args );
			} else {
				if ( inputDef.ticket && this.pendingDelegations[ inputDef.ticket ] ) {
					delete this.pendingDelegations[ inputDef.ticket ];
				}
				handlerName = stateObj[ inputDef.inputType ] ? inputDef.inputType : "*";
				isCatchAll = ( handlerName === "*" );
				handler = ( stateObj[ handlerName ] || this[ handlerName ] ) || this[ "*" ];
				action = clientMeta.state + "." + handlerName;
				clientMeta.currentAction = action;
				var eventPayload = this.buildEventPayload(
					client,
					{ inputType: inputDef.inputType, delegated: inputDef.delegated, ticket: inputDef.ticket }
				);
				if ( !handler ) {
					this.emit( NO_HANDLER, _.extend( { args: args }, eventPayload ) );
				} else {
					this.emit( HANDLING, eventPayload );
					if ( typeof handler === "function" ) {
						args.push(stateObj._data);
						result = handler.apply( this, this.getHandlerArgs( args, isCatchAll ));
					} else {
						result = handler;
						this.transition(client, handler, input);
					}
					this.emit( HANDLED, eventPayload );
				}
				clientMeta.priorAction = clientMeta.currentAction;
				clientMeta.currentAction = "";
			}
		}
		return result;
	},
	transitionOverload: function transitionOverload(client, newState, data) {
		var clientMeta = this.ensureClientMeta( client );
		var curState = clientMeta.state;
		var curStateObj = this.states[ curState ];
		var newStateObj = this.states[ newState ];
		var child;
		if ( !clientMeta.inExitHandler && newState !== curState ) {
			if ( newStateObj ) {
				if ( newStateObj._child ) {
					newStateObj._child = getChildFsmInstance( newStateObj._child );
					child = newStateObj._child && newStateObj._child.instance;
				}

				if ( curStateObj && curStateObj._onExit ) {
					clientMeta.inExitHandler = true;
					curStateObj._onExit.call( this, client, curStateObj._data);
					clientMeta.inExitHandler = false;
				}
				if(curStateObj)
				{
					curStateObj._data = null;
				} // cleanup data so it do not leak;
				if ( curStateObj && curStateObj._child && curStateObj._child.instance && this.hierarchy[ curStateObj._child.instance.namespace ] ) {
					this.hierarchy[ curStateObj._child.instance.namespace ].off();
				}
				clientMeta.targetReplayState = newState;
				clientMeta.priorState = curState;
				clientMeta.state = newState;
				if ( child ) {
					this.hierarchy[ child.namespace ] = utils.listenToChild( this, child );
				}
				var eventPayload = this.buildEventPayload( client, {
					fromState: clientMeta.priorState,
					action: clientMeta.currentAction,
					toState: newState
				} );
				this.emit( TRANSITION, eventPayload );
				if ( newStateObj._onEnter ) {

					newStateObj._onEnter.call( this, client, data);
					newStateObj._data = data;
				}
				if ( child ) {
					child.handle( client, "_reset" );
				}

				if ( clientMeta.targetReplayState === newState ) {
					this.processQueue( client, NEXT_TRANSITION );
				}
				return;
			}
			this.emit( INVALID_STATE, this.buildEventPayload( client, {
				state: clientMeta.state,
				attemptedState: newState
			} ) );
		}
	},

	deferAndTransitionOverload: function( client, stateName, data ) {
		this.deferUntilTransition( client, stateName );
		this.transition( client, stateName, data );
	},
	ensureClientMeta: function ensureClientMeta() {
		if ( !this._stamped ) {
			this._stamped = true;
			_.defaults( this, _.cloneDeep( getDefaultClientMeta() ) );
			this.initClient();
		}
		return this;
	},

	ensureClientArg: function( args ) {
		var _args = args;
		// we need to test the args and verify that if a client arg has
		// been passed, it must be this FSM instance (this isn't a behavioral FSM)
		if ( typeof _args[ 0 ] === "object" && !( "inputType" in _args[ 0 ] ) && _args[ 0 ] !== this ) {
			_args.splice( 0, 1, this );
		} else if ( typeof _args[ 0 ] !== "object" || ( typeof _args[ 0 ] === "object" && ( "inputType" in _args[ 0 ] ) ) ) {
			_args.unshift( this );
		}
		return _args;
	},

	getHandlerArgs: function( args, isCatchAll ) {
		// index 0 is the client, index 1 is inputType
		// if we're in a catch-all handler, input type needs to be included in the args
		// inputType might be an object, so we need to just get the inputType string if so
		var _args = args;
		var input = _args[ 1 ];
		if ( typeof inputType === "object" ) {
			_args.splice( 1, 1, input.inputType );
		}
		return isCatchAll ?
			_args.slice( 1 ) :
			_args.slice( 2 );
	},
	// "classic" machina FSM do not emit the client property on events (which would be the FSM itself)
	buildEventPayload: function() {
		var args = this.ensureClientArg( utils.getLeaklessArgs( arguments ) );
		var data = args[ 1 ];
		if ( _.isPlainObject( data ) ) {
			return _.extend( data, { namespace: this.namespace } );
		} else {
			return { data: data || null, namespace: this.namespace };
		}
	}
};

_.each( [
	"deferUntilTransition",
	"processQueue",
	"clearQueue"
], function( methodWithClientInjected ) {
	DynamicFsm[methodWithClientInjected] = function() {
		var args = this.ensureClientArg( utils.getLeaklessArgs( arguments ) );
		return BehavioralFsm.prototype[methodWithClientInjected].apply( this, args );
	};
} );
DynamicFsm["deferAndTransition"] = function(){
	var args = this.ensureClientArg( utils.getLeaklessArgs( arguments ) );
	return DynamicFsm.prototype["deferAndTransitionOverload"].apply( this, args );
};
DynamicFsm["handle"] = function(){
	var args = this.ensureClientArg( utils.getLeaklessArgs( arguments ) );
	return DynamicFsm.prototype["handleOverload"].apply( this, args );
};
DynamicFsm["transition"] = function(){
	var args = this.ensureClientArg( utils.getLeaklessArgs( arguments ) );
	return DynamicFsm.prototype["transitionOverload"].apply( this, args );
};
DynamicFsm = BehavioralFsm.extend( DynamicFsm );

