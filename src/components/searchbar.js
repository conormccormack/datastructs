import React, {PureComponent} from 'react';
import Autosuggest from 'react-autosuggest';
import {Redirect} from 'react-router-dom';
import '../css/autocomplete.css';

const dataStructures = [
    {
        category: "Trees",
        queries: [
            {
                name: 'Binary Search Tree',
                url: '/bst'
            },
        ]
    },
    {
        category: "Basics",
        queries: [

        ],
    },
    {
        category: "Sorting Algorithms",
        queries: [

        ],
    },
    {
        category: "Graph Algorithms",
        queries: [

        ]
    },

];

// Generate suggestions list based on user input matching to suggestion names.
function getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    if (inputValue.length === 0) {
        return []
    };

    return dataStructures
        .map(section => {
            return {
                category: section.category,
                queries: section.queries.filter(query => query.name.toLowerCase().includes(inputValue))
            };
        })
        .filter(section => section.queries.length > 0)

}

// Given a suggestion, return the name
const getSuggestionValue = suggestion => suggestion.name;

// Given a section, return an array of corresponding queries
const getSectionSuggestions = section => {
    return section.queries;
};

// Given a section, render its category name as bold text
const renderSectionTitle = section => (
    <strong>
        {section.category}
    </strong>
);

// Given a suggestion (query), render its name
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
            suggestions: [],
            enterDown: false,
        };
    }

    // Update value on change to input box.
    onChange = (event, { newValue }) => {
       this.setState({
           value: newValue
       });
    };

    onKeyDown = (event) => {
        if (event.key === 'Enter'){
            this.setState({
                enterDown: this.state.suggestions.length > 0 ? true: false,
            });
        }
    };

    // Repopulate suggestions whenever requested.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
           suggestions: getSuggestions(value)
        });
    };

    render(){
        const { value, suggestions } = this.state;

        const topSuggestionURL = (suggestions) => {
            return suggestions.flatMap(category => category.queries.filter(structure => structure.name.toLowerCase() === value.toLowerCase()));
        }

        topSuggestionURL(suggestions);
        const inputProps = {
            placeholder: 'Search (e.g. "AVL Tree")',
            value,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
        };

        const enterDown = this.state.enterDown;

        return(
            <div style={{marginLeft: 'auto', marginRight: '10px'}}>
                <Autosuggest
                    multiSection={true}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    getSectionSuggestions={getSectionSuggestions}
                    renderSuggestion={renderSuggestion}
                    renderSectionTitle={renderSectionTitle}
                    inputProps={inputProps}
                />
                {enterDown && topSuggestionURL(suggestions).length > 0 &&  <Redirect to={`${topSuggestionURL(suggestions)[0].url}`}/>}
            </div>
        );
    }

}

export default Searchbar;