import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';


const ResetAlertModal = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    警告
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>ゲームをリセットしますか？</div>
                    <div>復元することはできません。</div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} variant='secondary'>閉じる</Button>
                <Button onClick={props.handleAgree} variant='danger'>リセット</Button>
            </Modal.Footer>

        </Modal>
    )
}

ResetAlertModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    handleAgree: PropTypes.func.isRequired,
    agreeBtnText: PropTypes.string,
};

export default ResetAlertModal
