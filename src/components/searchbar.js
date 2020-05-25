import React, {PureComponent} from 'react';
import Autosuggest from 'react-autosuggest';
import '../css/autocomplete.css';

const datastructures = [
    {
        name: "AVL Tree",
        category: "Tree",
    },
    {
        name: "Binary Search Tree",
        category: "Tree",
    },
    {
        name: "Linked List",
        category: "Basics",
    },
    {
        name: 'Red-Black Tree',
        category: 'Tree',
    },
    {
        name: "Splay Tree",
        category: "Tree",
    },
    {
        name: "Queue",
        category: "Stack & Queues",
    },
    {
        name: "Stack",
        category: "Stack & Queues",
    },
];

// Generate suggestions list based on user input matching to suggestion names.
const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : datastructures.filter(datastruct =>
        datastruct.name.toLowerCase().includes(inputValue)
    );
};

// Retrieve value from suggestion that user has chosen
const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
);

class Searchbar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: []
        };
    }

    // Update value onChange.
    onChange = (event, { newValue }) => {
       this.setState({
           value: newValue
       });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
           suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render(){
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: '"AVL Trees"',
            value,
            onChange: this.onChange
        };

        return(
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }

}

export default Searchbar;