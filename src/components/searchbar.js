import React, {useState} from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';

function SearchBar(){
    const [suggestions, setSuggestions] = useState([]);
    const datastructures = [
        {
            name: "AVL Tree",
            category: "Tree",
        },
        {
            name: "Stack",
            category: "Stack & Queues",
        },
        {
            name: "Queue",
            category: "Stack & Queues",
        },
        {
            name: "Splay Tree",
            category: "Tree",
        },
        {
          name: "Linked List",
          category: "Basics",
        },
        {
            name: "Binary Search Tree",
            category: "Tree",
        }
    ];





    return (
        <div></div>
    )

}

export default SearchBar;