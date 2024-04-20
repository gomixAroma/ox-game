import Square from "./Square"
import style from './../assets/styles/Square.module.scss'
import PropTypes from 'prop-types';

const SquaresBox = (props) => {
    return (
        <>
            <div className={style.row}>
                <Square i={0} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
                <Square i={1} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
                <Square i={2} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
            </div>
            <div className={style.row}>
                <Square i={3} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
                <Square i={4} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
                <Square i={5} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
            </div>
            <div className={style.row}>
                <Square i={6} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
                <Square i={7} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
                <Square i={8} shakes={props.shakes} turn={props.turn} squareRemove={props.squareRemove} handleClick={props.handleClick} squares={props.squares} setSquares={props.setSquares} />
            </div>
        </>
    )
}

SquaresBox.propTypes = {
    shakes: PropTypes.array,
    turn: PropTypes.string,
    squareRemove: PropTypes.array,
    handleClick: PropTypes.func,
    squares: PropTypes.array,
    setSquares: PropTypes.func,
}

export default SquaresBox
