import React, {PureComponent} from 'react';
import Autosuggest from 'react-autosuggest';
import '../css/autocomplete.css';

const datastructures = [
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

    return datastructures
        .map(section => {
            return {
                category: section.category,
                queries: section.queries.filter(query => query.name.toLowerCase().includes(inputValue))
            };
        })
        .filter(section => section.queries.length > 0)

}

// Retrieve value from suggestion that user has chosen
const getSuggestionValue = suggestion => suggestion.name;

const getSectionSuggestions = section => {
    return section.queries;
};

const renderSectionTitle = section => {
    console.log(section)
    return (
    <strong>
        {section.category}
    </strong>
)};


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
    onChange = (event, { newValue, method }) => {
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
        );
    }

}

export default Searchbar;