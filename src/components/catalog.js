import React from 'react';
import Navbar from './navbar';
import queryString from 'query-string';
import styled from 'styled-components';

const CatalogContainer = styled.div`
    background-color: #EFE7E2;
    height: 100vh;
`
const CatalogHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 50px;
    padding-left: 6rem;
`

const Results = styled.div`
    display: grid;
    padding-left: 6rem;
    padding-right: 6rem;
`

const ResultCategory = styled.div`
    font-size: 35px;
    font-family: Raleway;
    padding-top: 1rem;
`

const ResultPage = styled.div`
    font-size: 18px;
`

const Pages = [
    {
        category: "Trees",
        queries: [
            {
                name: 'AVL Tree',
                url: 'tree/avl'
            },
            {
                name: 'Binary Search Tree',
                url: 'tree/bst'
            },
            {
                name: 'Red-Black Tree',
                url: 'tree/redblack'
            },
            {
                name: 'Splay Tree',
                url: 'tree/splay'
            },
        ]
    },
    {
        category: "Basics",
        queries: [
            {
                name: 'Linked List',
                url: 'linkedlist',
            },
            {
                name: 'Stack',
                url: 'stack',
            },
            {
                name: 'Queue',
                url: 'queue',
            },
        ],
    },
    {
        category: "Sorting Algorithms",
        queries: [
            {
                name: 'Bubble Sort',
                url: 'sort/bubble',
            },
            {
                name: 'Selection Sort',
                url: 'sort/selection',
            },
            {
                name: 'Insertion Sort',
                url: 'sort/insertion',
            },
            {
                name: 'Merge Sort',
                url: 'sort/merge',
            },
            {
                name: 'Quick Sort',
                url: 'sort/quick',
            },
            {
                name: 'Radix Sort',
                url: 'sort/radix',
            },
            {
                name: 'Heap Sort',
                url: 'sort/heap',
            },
        ],
    },
    {
        category: "Graph Algorithms",
        queries: [
            {
                name: 'Breadth-First Search',
                url: 'graph/bfs',
            },
            {
                name: 'Depth-First Search',
                url: 'graph/dfs',
            },
            {
                name: 'Dijkstra\'s Algorithm',
                url: 'graph/dijkstras',
            },
            {
                name: 'Prim\'s Algorithm',
                url: 'graph/prims',
            },
            {
                name: 'Topological Sort',
                url: 'graph/topological',
            },
            {
                name: 'Kruskal\'s Sort',
                url: 'graph/kruskals',
            },
        ]
    },

];

const resultsByCategory = (query, filt, db) => {
    let results = [];
    for (let i = 0; i < db.length; i++) {
        let res = [];
        if (filt !== 'all' && db[i].category.toLowerCase() !== filt.toLowerCase()) continue;
        for (let j = 0; j < db[i].queries.length; j++) {
            if ((filt === 'all' && query === '') || db[i].queries[j].name.toLowerCase().includes(query.toLowerCase())){
                res.push(db[i].queries[j]);
            }
        }
        if (res.length > 0) results.push({category: db[i].category, results: res});
    }
    return resultsToHTML(results);
};

const resultsToHTML = (results) => {
    if (results.length === 0) return ('There are no items matching your search.');
    else {
        return results.map(cat => <div>
            <ResultCategory>{cat.category}</ResultCategory>
                {cat.results.map(result => <ResultPage> {result.name}</ResultPage>)}
        </div>
        )
    };
};

function Catalog(props){
    const query = queryString.parse(props.location.search);
    const SearchResults = resultsByCategory(query.term ? query.term : '', query.view, Pages);

    return(
        <CatalogContainer>
            <Navbar/>
            {query.term ? <CatalogHeadline>Search results for {query.term}:</CatalogHeadline> :
                <CatalogHeadline>This is the catalog filtered by {query.view}.</CatalogHeadline>
            }
            <Results>
                {SearchResults}
            </Results>
        </CatalogContainer>
    )
}

export default Catalog;