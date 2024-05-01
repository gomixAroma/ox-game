import PropTypes from 'prop-types'
import OXmark from './OXmark';

const PlayerWaiting = ({ data }) => {
    const t1 = "プレイヤー";
    const t2 = "を接続してください";
    const imgStyle = {
        width: '20px',
        height: '20px',
        margin: '0 2px',
    }

    if (data && !data.X && data.O) {
        return (
            <div className='d-flex my-2'>
                <span>{t1}</span>
                {/* <img src={X} alt="バツ" style={imgStyle} /> */}
                <OXmark mark="X" style={imgStyle} />
                <span>{t2}</span>
            </div>
        )
    } else if (data && !data.O && data.X) {
        return (
            <div className='d-flex my-2'>
                <span>{t1}</span>
                {/* <img src={O} alt="マル" style={imgStyle} /> */}
                <OXmark mark="O" style={imgStyle} />
                <span>{t2}</span>
            </div>
        )
    }
    return;
}

export default PlayerWaiting

PlayerWaiting.propTypes = {
    data: PropTypes.object,
}
