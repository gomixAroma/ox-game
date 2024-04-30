//mark = 'O' or 'X'
//width = int(px)
//height = int(px)
//className
//style

import X from "./../assets/images/SVG/x.svg"
import O from "./../assets/images/SVG/o.svg"
import PropTypes from 'prop-types'
const OXmark = ({ mark, width, height, className, style }) => {
    if (mark === "X" || mark === "O") {
        return (
            <img
                src={mark === "X" ? (X) : (O)}
                alt={mark === "X" ? "バツ" : "マル"}
                width={width}
                {...height && { height: height }}
                {...className && { className: className }}
                {...style && { style: style }}
            />
        )
    } else {
        console.error("mark is not 'O' or 'X'");
        return;
    }
}

export default OXmark

OXmark.propTypes = {
    mark: PropTypes.oneOf(["X", "O"]).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
}
