import React, { useState, useEffect } from 'react';

const ClosedCodeCaptions = (props) => {
    const [ lines, setLines ] = useState([]);

    useEffect(() => {
        setLines(props.lines);
    }, [props] )

    return (
        <div style={{backgroundColor: '#F2F3F5' }}>
        {lines.map((line, index) =>
            <div key={index} style={{ 
                backgroundColor: `${index === props.current ? 'black' : 'transparent'}`,
                color: `${index === props.current ? 'white' : 'black'}`,
                marginLeft: `${line.indent * 20}px`,
                }}>{line.value}
            </div>
        )}
        </div>
    )
}

export default ClosedCodeCaptions;