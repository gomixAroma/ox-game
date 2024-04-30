import PropTypes from 'prop-types'
import X from "./../assets/images/SVG/x.svg"
import O from "./../assets/images/SVG/o.svg"

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
            <div className='d-flex'>
                <span>{t1}</span>
                <img src={X} alt="バツ" style={imgStyle} />
                <span>{t2}</span>
            </div>
        )
    } else if (data && !data.O && data.X) {
        return (
            <div className='d-flex'>
                <span>{t1}</span>
                <img src={O} alt="マル" style={imgStyle} />
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
