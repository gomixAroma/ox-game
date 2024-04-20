import PropTypes from 'prop-types';
import X from "./../assets/images/SVG/x.svg"
import O from "./../assets/images/SVG/o.svg"
// import { useState } from 'react';

const mark = {
    width: "40px",
    height: "40px",
    pointerEvents: "none",
}

const text = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
}

const OnlineTurn = (props) => {
    return (
        <>
            {props.onlineTurn ? (
                <div style={text}>
                    <div style={{ marginRight: "8px" }}>あなたは</div>
                    {
                        props.onlineTurn === "X" ? (
                            <img src={X} alt="あなたはバツです。" style={mark} />
                        ) : (
                            <img src={O} alt="あなたはマルです。" style={mark} />
                        )
                    }
                </div>
            ) : (
                <>
                    <div>接続なし</div>
                </>
            )}
        </>
    )
}

OnlineTurn.propTypes = {
    onlineTurn: PropTypes.string
};

export default OnlineTurn
