// READ (component life cycle): 
// http://javascript.tutorialhorizon.com/2014/09/13/execution-sequence-of-a-react-components-lifecycle-methods/

// component for each list element
var Lists = React.createClass({
	render: function() {
		return (
			<li className="Lists">
				{this.props.list}
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
				<Lists list={list.name} />
			);
		});

		return (
			<div className="ListOfLists">
				{listNodes}
			</div>
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
	render: function() {
		// the return is a call to the ListOfLists component
		// with the lists props being set
		return (
			<div className="ListBox">
				<ListOfLists lists={this.state.lists} />
			</div>
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