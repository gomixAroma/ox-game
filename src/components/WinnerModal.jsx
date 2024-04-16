import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { WinnerContext } from './../App.jsx';
import X from "./../assets/images/SVG/x.svg"
import O from "./../assets/images/SVG/o.svg"

const WinnerModal = (props) => { // Import the WinnerContext from its source file

    const winner = useContext(WinnerContext);
    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    勝者
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='text-center'>
                    {winner === "X" ? (
                        <img src={X} alt="バツが勝ちました。" width={100} />
                    ) : (
                        <img src={O} alt="マルが勝ちました。" width={100} />
                    )}
                    <div aria-hidden="true" style={{ fontSize: "1.25rem" }}>{winner === "X" ? ("バツ") : ("マル")}が勝ちました</div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>閉じる</Button>
            </Modal.Footer>
        </Modal>

    )
}

WinnerModal.propTypes = {
    onHide: PropTypes.func,
};

export default WinnerModal
