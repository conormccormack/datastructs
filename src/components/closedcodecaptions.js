import React, { useState, useEffect } from 'react';

const ClosedCodeCaptions = (props) => {
    const [ lines, setLines ] = useState([]);

    useEffect(() => {
        setLines(props.lines);
    }, [props] )

    return (
        <div>
        {lines.map((line, index) =>
            <div key={index} style={{ 
                backgroundColor: `${index === props.current ? '#ee6c4d' : 'transparent'}`,
                }}>
                <span style={{ color: `${index === props.current ? 'white' : 'black'}`, marginLeft: `${line.indent * 20}px`}}>
                    {line.value}
                </span>
            </div>
        )}
        </div>
    )
}

export default ClosedCodeCaptions;