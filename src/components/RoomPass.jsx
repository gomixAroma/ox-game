import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from 'prop-types';

const style = {
    height: "30px",
}

const RoomPass = ({ value }) => {
    const handleClick = (e) => {
        navigator.clipboard.writeText(e.target.value);
    }
    return (
        <InputGroup >
            <Form.Control
                style={style}
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                placeholder="コードを入力"
                className={`text-center`}
                value={value}
                readOnly
                onClick={handleClick}
            />
        </InputGroup>
    )
}

export default RoomPass

RoomPass.propTypes = {
    value: PropTypes.string.isRequired,
}
