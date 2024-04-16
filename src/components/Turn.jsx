import X from "./../assets/images/SVG/x.svg"
import O from "./../assets/images/SVG/o.svg"
import style from './../assets/styles/Turn.module.scss'

import PropTypes from 'prop-types';

const Turn = ({ turn, logMode, winner }) => {
    return (
        <>
            {logMode ? (
                <div className={style.turn}>
                    <div className={`${style.text} ${style.winner}`}>勝者</div>
                    {winner === "X" ? (
                        <img src={X} alt="バツのターンです。" className={style.mark} />
                    ) : (
                        <img src={O} alt="マルのターンです。" className={style.mark} />
                    )}
                </div>
            ) : (
                <div className={style.turn}>
                    {turn === "X" ? (
                        <img src={X} alt="バツのターンです。" className={style.mark} />
                    ) : (
                        <img src={O} alt="マルのターンです。" className={style.mark} />
                    )}
                    <div className={style.text} aria-hidden="true">のターン</div>
                </div>
            )}
        </>
    )
}

Turn.propTypes = {
    turn: PropTypes.string.isRequired,
    logMode: PropTypes.bool,
    winner: PropTypes.string,
};

export default Turn
