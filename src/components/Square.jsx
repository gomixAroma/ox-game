import PropTypes from 'prop-types';
import style from './../assets/styles/Square.module.scss'

const Square = ({ i, shakes, squareRemove, handleClick, squares }) => {

    const styleX = {
        fill: squareRemove[i] <= 2 ? ("#FF8000") : ("red"),
        stroke: squareRemove[i] <= 2 ? ("#FF8000") : ("red"),
        strokeMiterlimit: "10",
    }

    const styleO = {
        fill: "none",
        stroke: squareRemove[i] <= 2 ? ("#01DFD7") : ("blue"),
        strokeMiterlimit: "10",
        strokeWidth: "20px",
    }

    return (
        <div className={style.box} onClick={() => handleClick(i)} data-remove={squareRemove[i]} >
            <div className={`${style.mark} ${shakes[i]}`}>
                {squares[i] === "X" ? (
                    <svg id="b" data-name="バツ" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144.25 144.38">
                        <g id="c" data-name="バツ">
                            <g>
                                <rect x="63.18" y="-19.63" width="17.66" height="184" transform="translate(174.09 72.63) rotate(135)" style={styleX} />
                                <rect x="63.42" y="-20" width="17.66" height="184" transform="translate(72.07 -30) rotate(45)" style={styleX} />
                            </g>
                        </g>
                    </svg>
                ) : (
                    squares[i] === "O" ? (
                        <svg id="b" data-name="マル" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154 154">
                            <g id="c" data-name="マル">
                                <circle cx="77" cy="77" r="67" style={styleO} />
                            </g>
                        </svg>
                    ) : (
                        <></>
                    )
                )}
            </div>
        </div >
    )
}

Square.propTypes = {
    i: PropTypes.number,
    squareRemove: PropTypes.array,
    handleClick: PropTypes.func,
    squares: PropTypes.array,
    shakes: PropTypes.array,
};

export default Square
