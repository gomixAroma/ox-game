import PropTypes from 'prop-types';
import X from "./../assets/images/SVG/x.svg"
import O from "./../assets/images/SVG/o.svg"
// import { useState } from 'react';

const mark = {
    height: "25px",
    pointerEvents: "none",
}

const text = {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
}

const des = {
    width: "80px",
    margin: "2px 0",
}

const OnlineTurn = (props) => {
    return (
        <>
            {props.onlineTurn ? (
                <div>
                    <div style={text}>
                        <div style={des}>あなたは</div>
                        {
                            props.onlinePlayerMark === "X" ? (
                                <img src={X} alt="あなたはバツです。" style={mark} />
                            ) : (
                                <img src={O} alt="あなたはマルです。" style={mark} />
                            )
                        }
                    </div>
                    <div style={text}>
                        <div style={des}>ターン</div>
                        {
                            props.onlineTurn === "X" ? (
                                <img src={X} alt="現在のターンはバツ" style={mark} />
                            ) : (
                                <img src={O} alt="現在のターンはバツ" style={mark} />
                            )
                        }
                    </div>
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
    onlineTurn: PropTypes.string,
    turn: PropTypes.string,
    onlinePlayerMark: PropTypes.string,
};

export default OnlineTurn
