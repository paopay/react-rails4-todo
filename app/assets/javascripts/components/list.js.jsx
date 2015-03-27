// READ (component life cycle): 
// http://javascript.tutorialhorizon.com/2014/09/13/execution-sequence-of-a-react-components-lifecycle-methods/

// component for each list element
var Lists = React.createClass({
	render: function() {
		return (
			<li className="Lists">
				<a href={"/lists/" + this.props.id} >{this.props.name}</a>
				<span className="glyphicon glyphicon-remove pull-right" aria-hidden="true"></span>
			</li>
		);
	}
});

// component for the whole list of lists
// the List component is called in here
var ListOfLists = React.createClass({
	render: function() {
		var listNodes = this.props.lists.map(function (list) {
			return (
				<Lists name={list.name} id={list.id} key={list.id} />
			);
		});

		return (
			<ul className="ListOfLists">
				{listNodes}
			</ul>
		);
	}
});

// component for containing the list of lists
// responsible for talking to server and grabbing new lists
// ListOfLists is called in here
var ListBox = React.createClass({
	// sets initial states for lists - empty array in this case
	// only executed once per component life cycle
	getInitialState: function() {
		return {
			lists: [] 
		};
	},
	// invoked on client side after initial rendering
	// best to send AJAX requests within here
	// https://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount
	componentDidMount: function() {
		this.loadListsFromServer();
	},
	// ajax call to rails
	loadListsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: "json",
			success: function (lists) {
				// setState is the primary method to trigger UI updates from event handles / server callbacks
				// here it is setting the component's lists state to the data received from the server
				// causes component to re-render 
				// https://facebook.github.io/react/docs/component-api.html#setstate
				this.setState({
					lists: lists 
				});
				// 'this' inside the ajax call is the ajax object
				// therefore, it needs to be bound to the react component
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleListSubmit: function(list) {
		// add created list to array of lists
		// set the state of ListBox to be the new list
		console.log('in handleListSubmit');
		var lists = this.state.lists;
		var newLists = lists.concat([list]);
		this.setState({lists: newLists});
		$.ajax({
			url: this.props.url,
			dataType: "json",
			type: "POST",
			data: {"list": list},
			// successfully posting a new list calls the
			// loadListFromServer function to re-render the component
			success: function (data) {
				console.log('in handleListSubmit ajax success');
				this.loadListsFromServer();
			}.bind(this),
			error: function (xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	render: function() {
		// the return is a call to the ListOfLists component
		// with the lists props being set
		// *
		// also calls ListForm Component and sets onListSubmit prop to the function handleListSubmit
		return (
			<div className="ListBox">
				<ListOfLists lists={this.state.lists} />
				<ListForm onListSubmit={this.handleListSubmit} />
			</div>
		);
	}
});

// component for list form
var ListForm = React.createClass({
	// getDOMNode grabs the dom element based on the react component
	// calls onListSubmit prop which points to the handleListSubmit function in the ListBox component
	// sets name input back to blank
	handleSubmit: function(e) {
		console.log('in handle submit');
		var name = this.refs.name.getDOMNode().value.trim();
		this.props.onListSubmit({name: name});
		this.refs.name.getDOMNode().value = "";
		e.preventDefault();
	},

	render: function() {
		// calls function above (handleSubmit) when submitted
		return (
			<form className="ListForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Name of list" ref="name" />
				<input type="submit" value="Create List" />
			</form>
		);
	}
});

// react render
var readyLists = function() {
	React.render(
		<ListBox url="/lists.json" />,
		document.getElementById("lists")
	);
};

$(document).ready(readyLists);