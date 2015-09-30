/* global _ */
module.exports = function( machina ) {
	var BehavioralFsm = machina.BehavioralFsm;
	var Fsm = machina.Fsm;
	var DynamicFsm = machina.DynamicFsm;
	var behavioralFsmOptions = require( "./behavioralFsmOptions.js" );
	var classicFsmOptions = require( "./classicFsmOptions.js" );
	var dynamicFsmOptions = require("./dynamicFsmOptions");
	return {
		behavioral: {
			"With No Inheritance": {
				instanceWithDefaults: function() {
					return new machina.BehavioralFsm( { states: { uninitialized: {} } } );
				},
				instanceWithOptions: function( opt ) {
					return new machina.BehavioralFsm( _.merge( {}, this.options, ( opt || {} ) ) );
				},
				options: _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent, behavioralFsmOptions.child )
			},
			"With Some Inheritance": {
				instanceWithDefaults: function() {
					var ParentFsm = BehavioralFsm.extend( { states: { uninitialized: {} } } );
					return new ParentFsm();
				},
				instanceWithOptions: function( opt ) {
					var options = _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent, behavioralFsmOptions.child, ( opt || {} ) );
					var ParentFsm = BehavioralFsm.extend( options );
					return new ParentFsm();
				},
				extendingWithStaticProps: function() {
					var options = _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent, behavioralFsmOptions.child );
					var ParentFsm = BehavioralFsm.extend( options, { someStaticMethod: function() {} } );
					return ParentFsm;
				},
				options: _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent, behavioralFsmOptions.child )
			},
			"With More Inheritance": {
				instanceWithDefaults: function() {
					var ParentFsm = BehavioralFsm.extend( { states: { uninitialized: {} } } );
					var ChildFsm = ParentFsm.extend( {} );
					return new ChildFsm();
				},
				instanceWithOptions: function( opt ) {
					var options = _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent );
					var ParentFsm = BehavioralFsm.extend( options );
					var ChildFsm = ParentFsm.extend( _.merge( {}, behavioralFsmOptions.child, ( opt || {} ) ) );
					return new ChildFsm();
				},
				extendingWithStaticProps: function() {
					var options = _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent );
					var ParentFsm = BehavioralFsm.extend( options, { someStaticMethod: function() {} } );
					var ChildFsm = ParentFsm.extend( _.merge( {}, behavioralFsmOptions.child ) );
					return ChildFsm;
				},
				options: _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent, behavioralFsmOptions.child )
			},
			"With Too Much Inheritance": {
				instanceWithDefaults: function() {
					var GrandparentFsm = BehavioralFsm.extend( { states: { uninitialized: {} } } );
					var ParentFsm = GrandparentFsm.extend( {} );
					var ChildFsm = ParentFsm.extend( {} );
					return new ChildFsm();
				},
				instanceWithOptions: function( opt ) {
					var GrandparentFsm = BehavioralFsm.extend( behavioralFsmOptions.grandparent );
					var ParentFsm = GrandparentFsm.extend( behavioralFsmOptions.parent );
					var ChildFsm = ParentFsm.extend( _.merge( {}, behavioralFsmOptions.child, ( opt || {} ) ) );
					return new ChildFsm();
				},
				extendingWithStaticProps: function() {
					var GrandparentFsm = BehavioralFsm.extend( behavioralFsmOptions.grandparent, { someStaticMethod: function() {} } );
					var ParentFsm = GrandparentFsm.extend( behavioralFsmOptions.parent );
					var ChildFsm = ParentFsm.extend( _.merge( {}, behavioralFsmOptions.child ) );
					return ChildFsm;
				},
				options: _.merge( {}, behavioralFsmOptions.grandparent, behavioralFsmOptions.parent, behavioralFsmOptions.child )
			}
		},
		machinaFsm: {
			"With No Inheritance": {
				instanceWithDefaults: function() {
					return new machina.Fsm( { states: { uninitialized: {} } } );
				},
				instanceWithOptions: function( opt ) {
					return new machina.Fsm( _.merge( {}, this.options, ( opt || {} ) ) );
				},
				options: _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent, classicFsmOptions.child )
			},
			"With Some Inheritance": {
				instanceWithDefaults: function() {
					var ParentFsm = Fsm.extend( { states: { uninitialized: {} } } );
					return new ParentFsm();
				},
				instanceWithOptions: function( opt ) {
					var options = _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent, classicFsmOptions.child );
					var ParentFsm = Fsm.extend( _.merge( {}, options, opt ) );
					return new ParentFsm();
				},
				extendingWithStaticProps: function() {
					var options = _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent, classicFsmOptions.child );
					var ParentFsm = Fsm.extend( options, { someStaticMethod: function() {} } );
					return ParentFsm;
				},
				options: _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent, classicFsmOptions.child )
			},
			"With More Inheritance": {
				instanceWithDefaults: function() {
					var ParentFsm = Fsm.extend( { states: { uninitialized: {} } } );
					var ChildFsm = ParentFsm.extend( {} );
					return new ChildFsm();
				},
				instanceWithOptions: function( opt ) {
					var options = _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent );
					var ParentFsm = Fsm.extend( options );
					var ChildFsm = ParentFsm.extend( _.merge( {}, classicFsmOptions.child, opt ) );
					return new ChildFsm();
				},
				extendingWithStaticProps: function() {
					var options = _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent );
					var ParentFsm = Fsm.extend( options, { someStaticMethod: function() {} } );
					var ChildFsm = ParentFsm.extend( _.merge( {}, classicFsmOptions.child ) );
					return ChildFsm;
				},
				options: _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent, classicFsmOptions.child )
			},
			"With Too Much Inheritance": {
				instanceWithDefaults: function() {
					var GrandparentFsm = Fsm.extend( { states: { uninitialized: {} } } );
					var ParentFsm = GrandparentFsm.extend( {} );
					var ChildFsm = ParentFsm.extend( {} );
					return new ChildFsm();
				},
				instanceWithOptions: function( opt ) {
					var GrandparentFsm = Fsm.extend( classicFsmOptions.grandparent );
					var ParentFsm = GrandparentFsm.extend( classicFsmOptions.parent );
					var ChildFsm = ParentFsm.extend( _.merge( {}, classicFsmOptions.child, opt ) );
					return new ChildFsm();
				},
				extendingWithStaticProps: function() {
					var GrandparentFsm = Fsm.extend( classicFsmOptions.grandparent, { someStaticMethod: function() {} } );
					var ParentFsm = GrandparentFsm.extend( classicFsmOptions.parent );
					var ChildFsm = ParentFsm.extend( _.merge( {}, classicFsmOptions.child ) );
					return ChildFsm;
				},
				options: _.merge( {}, classicFsmOptions.grandparent, classicFsmOptions.parent, classicFsmOptions.child )
			}
		},
		dynamic:{
			"With No Inheritance": {
				instanceWithDefaults: function() {
					return new machina.DynamicFsm( { states: { uninitialized: {} } } );
				},
				instanceWithOptions: function( opt ) {
					return new machina.DynamicFsm( _.merge( {}, this.options, ( opt || {} ) ) );
				},
				options: _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent, dynamicFsmOptions.child )
			},
			"With Some Inheritance": {
				instanceWithDefaults: function() {
					var ParentFsm = DynamicFsm.extend( { states: { uninitialized: {} } } );
					return new ParentFsm();
				},
				instanceWithOptions: function( opt ) {
					var options = _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent, dynamicFsmOptions.child );
					var ParentFsm = DynamicFsm.extend( _.merge( {}, options, opt ) );
					return new ParentFsm();
				},
				extendingWithStaticProps: function() {
					var options = _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent, dynamicFsmOptions.child );
					var ParentFsm = DynamicFsm.extend( options, { someStaticMethod: function() {} } );
					return ParentFsm;
				},
				options: _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent, dynamicFsmOptions.child )
			},
			"With More Inheritance": {
				instanceWithDefaults: function() {
					var ParentFsm = DynamicFsm.extend( { states: { uninitialized: {} } } );
					var ChildFsm = ParentFsm.extend( {} );
					return new ChildFsm();
				},
				instanceWithOptions: function( opt ) {
					var options = _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent );
					var ParentFsm = DynamicFsm.extend( options );
					var ChildFsm = ParentFsm.extend( _.merge( {}, dynamicFsmOptions.child, opt ) );
					return new ChildFsm();
				},
				extendingWithStaticProps: function() {
					var options = _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent );
					var ParentFsm = DynamicFsm.extend( options, { someStaticMethod: function() {} } );
					var ChildFsm = ParentFsm.extend( _.merge( {}, dynamicFsmOptions.child ) );
					return ChildFsm;
				},
				options: _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent, dynamicFsmOptions.child )
			},
			"With Too Much Inheritance": {
				instanceWithDefaults: function() {
					var GrandparentFsm = DynamicFsm.extend( { states: { uninitialized: {} } } );
					var ParentFsm = GrandparentFsm.extend( {} );
					var ChildFsm = ParentFsm.extend( {} );
					return new ChildFsm();
				},
				instanceWithOptions: function( opt ) {
					var GrandparentFsm = DynamicFsm.extend( dynamicFsmOptions.grandparent );
					var ParentFsm = GrandparentFsm.extend( dynamicFsmOptions.parent );
					var ChildFsm = ParentFsm.extend( _.merge( {}, dynamicFsmOptions.child, opt ) );
					return new ChildFsm();
				},
				extendingWithStaticProps: function() {
					var GrandparentFsm = DynamicFsm.extend( dynamicFsmOptions.grandparent, { someStaticMethod: function() {} } );
					var ParentFsm = GrandparentFsm.extend( dynamicFsmOptions.parent );
					var ChildFsm = ParentFsm.extend( _.merge( {}, dynamicFsmOptions.child ) );
					return ChildFsm;
				},
				options: _.merge( {}, dynamicFsmOptions.grandparent, dynamicFsmOptions.parent, dynamicFsmOptions.child )
			}
		}
	};
};
