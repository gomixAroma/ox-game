import style from './../assets/styles/Square.module.scss'
import onlineSVG from "./../assets/images/SVG/online.svg";
import OnlineTurn from './OnlineTurn';
import Turn from './Turn';
import PropTypes from 'prop-types';

const Head = (props) => {
    return (
        <>
            <div className={style.top}>
                <div className={style.title} aria-label='タイトル'>
                    <div className='d-flex'>
                        <span>三目並べ</span>
                        <img src={onlineSVG} alt="オンラインモード" className={props.playMode === "offline" ? "invisible" : "visible"} width={40} style={{ marginLeft: "5px", }} />
                    </div>
                    <span aria-label='モード:'>{props.playMode === "offline" ? "オフライン" : "オンライン"}</span>
                </div>
                {/* 履歴を見るときはターンではなく勝者を表示 */}
                {/* {props.onlineTurn ? (
                    <OnlineTurn turn={props.onlineTurn} onlineTurn={props.onlineTurn} />
                ) : (
                    props.playMode === "offline" &&
                    (<Turn turn={props.turn} logMode={props.logMode} winner={props.winner} />)
                )} */}
                {props.playMode === "offline" ? (
                    <Turn turn={props.turn} logMode={props.logMode} winner={props.winner} />
                ) : (
                    <OnlineTurn onlinePlayerMark={props.onlinePlayerMark} onlineTurn={props.onlineTurn} />
                )}
            </div>
        </>
    )
}

Head.propTypes = {
    playMode: PropTypes.string,
    onlineTurn: PropTypes.string,
    turn: PropTypes.string,
    logMode: PropTypes.bool,
    winner: PropTypes.string,
    onlinePlayerMark: PropTypes.string,
}

export default Head
