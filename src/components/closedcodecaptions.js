import React, { useState, useEffect } from 'react';

const ClosedCodeCaptions = (props) => {
    const [ lines, setLines ] = useState([]);

    useEffect(() => {
        setLines(props.lines);
    }, [props] )

    return (
        <div>
        {lines.map((line, index) =>
            <div key={index} style={{ backgroundColor: `${index === props.current ? 'white' : 'black'}`, color: `${index === props.current ? 'black' : 'white'}` }}>{line}</div>
        )}
        </div>
    )
}

export default ClosedCodeCaptions;