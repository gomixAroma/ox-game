import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import X from "./../assets/images/SVG/x.svg"
import O from "./../assets/images/SVG/o.svg"
import style from './../assets/styles/WinnerLogModal.module.scss'

const WinnerTable = ({ log, i }) => {
    const width = 30;

    const par = `?squares=${log.squares}&winner=${log.winner}&date=${log.date}`;

    const handleClick = () => {
        window.location.href = `${window.location.origin}${window.location.pathname}${par}`;
    }
    return (
        <div
            className={`d-flex ${style.log} ${i === 0 ? (style.borderNone) : ("")}`}
            onClick={handleClick}
        // data-log={par}
        >
            <div >
                {log.winner === "X" ? (
                    <img src={X} alt="バツ" width={width} />
                ) : (
                    <img src={O} alt="マル" width={width} />
                )}
            </div>
            <div >
                {log.date}
            </div>
        </div >
    );
}

WinnerTable.propTypes = {
    log: PropTypes.object,
    i: PropTypes.number,
};


const WinnerLogModal = (props) => {
    const [winnerLogs, setWinnerLogs] = useState(JSON.parse(localStorage.getItem("OXwinnerLog")));
    useEffect(() => {
        setWinnerLogs(JSON.parse(localStorage.getItem("OXwinnerLog")));
    }, [props.show]);
    const handleRemove = () => {
        props.handleClose();
        localStorage.removeItem("OXwinnerLog");
        setWinnerLogs([]);
    }
    return (
        <Modal show={props.show} onHide={props.handleClose} size='sm'>
            <Modal.Header closeButton>
                <Modal.Title>履歴</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={winnerLogs && (style.logTable)}>
                    {winnerLogs ? (<>
                        {winnerLogs.map((log, index) => (
                            <WinnerTable key={index} log={log} i={index} />
                        ))}
                    </>) : ("履歴がありません")}
                </div>
                {winnerLogs && (
                    <div className='mt-2'>
                        <Button className='w-100' onClick={handleRemove}>履歴を削除</Button>
                        <div className='small text-center w-100'>※すぐに削除されます</div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.handleClose}>
                    閉じる
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

WinnerLogModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
}

export default WinnerLogModal
