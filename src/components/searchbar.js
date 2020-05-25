import React, {PureComponent} from 'react';
import Autosuggest from 'react-autosuggest';
import {Redirect} from 'react-router-dom';
import '../css/autocomplete.css';
import Home from "./home";

const dataStructures = [
    {
        category: "Trees",
        queries: [
            {
                name: 'AVL Tree'
            },
            {
                name: 'Binary Search Tree'
            },
            {
                name: 'Red-Black Tree'
            },
            {
                name: 'Splay Tree'
            },
        ]
    },
    {
        category: "Basics",
        queries: [
            {
                name: 'Linked List'
            },
            {
                name: 'Stack'
            },
            {
                name: 'Queue'
            },
        ],
    },
    {
        category: "Sorting Algorithms",
        queries: [
            {
                name: 'Bubble Sort'
            },
            {
                name: 'Selection Sort'
            },
            {
                name: 'Insert Sort'
            },
            {
                name: 'Merge Sort'
            },
            {
                name: 'Quick Sort'
            },
            {
                name: 'Radix Sort'
            },
            {
                name: 'Heap Sort'
            },
        ],
    },
    {
        category: "Graph Algorithms",
        queries: [
            {
                name: 'Breadth-First Search'
            },
            {
                name: 'Depth-First Search'
            },
            {
                name: 'Dijkstra\'s Algorithm'
            },
            {
                name: 'Prim\'s Algorithm'
            },
            {
                name: 'Topological Sort'
            },
            {
                name: 'Kruskal\'s Sort'
            },
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
                enterDown: true,
            });
        }
    };

    // Repopulate suggestions whenever requested.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
           suggestions: getSuggestions(value)
        });
    };

    // Clean up function
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render(){
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Search (e.g. "AVL Tree")',
            value,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
        };

        const enterDown = this.state.enterDown;

        return(
            <div>
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
                {enterDown ? <Redirect to={`/catalog/?view=all&term=${this.state.value}`}/> : ''}
            </div>
        );
    }

}

export default Searchbar;