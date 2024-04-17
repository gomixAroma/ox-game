import { useContext, useState } from 'react';
import style from './../assets/styles/PlayModeChange.module.scss'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PlayModeContext } from '../App';
import PropTypes from 'prop-types';

const PlayModeChange = ({ setPlayMode }) => {
    const [show, setShow] = useState(false);
    const playMode = useContext(PlayModeContext);
    playMode;

    // 一時的に非表示
    const visible = false;
    if (!visible) return null;

    const handleChange = (mode) => {
        setPlayMode(mode);
        setShow(false);
        console.log("モードを変更しました。", mode)

    }

    return (
        <>
            <div className={style.playChange} onClick={() => setShow(true)}>
                <div className={`text-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" strokeWidth="2.5" stroke="black" fill="none" ><circle cx="22.83" cy="22.57" r="7.51"></circle><path d="M38 49.94a15.2 15.2 0 00-15.21-15.2h0a15.2 15.2 0 00-15.2 15.2z"></path><circle cx="44.13" cy="27.22" r="6.05"></circle><path d="M42.4 49.94h14A12.24 12.24 0 0044.13 37.7h0a12.21 12.21 0 00-5.75 1.43"></path></svg>
                </div>
                <div className={style.changeText}>モード変更</div>
            </div>
            {/*  モーダル */}
            <Modal show={show} onHide={() => setShow(false)} size='sm'>
                <Modal.Header closeButton>
                    <Modal.Title>プレイモードを変更</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Button className='w-100' variant="primary" onClick={() => handleChange("online")}>オンラインモード</Button>
                        <Button className='w-100 mt-2' variant="primary" onClick={() => handleChange("offline")}>オフラインモード</Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        閉じる
                    </Button>
                </Modal.Footer>
            </Modal >
        </>

    )
}

PlayModeChange.propTypes = {
    setPlayMode: PropTypes.func,
};

export default PlayModeChange
