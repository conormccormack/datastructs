import React, { useState, useEffect } from 'react';

const ClosedCodeCaptions = (props) => {
    const [ lines, setLines ] = useState([]);

    useEffect(() => {
        setLines(props.lines);
    }, [props.lines] )

    return (
        <div>
        {lines.map((line, index) =>
            <div style={{ backgroundColor: `${index === props.current ? 'white' : 'black'}`, color: `${index === props.current ? 'black' : 'white'}` }}>{line}</div>
        )}
        </div>
    )
}

export default ClosedCodeCaptions;