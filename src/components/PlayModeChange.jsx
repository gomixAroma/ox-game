import { useEffect, useState } from 'react';
import style from './../assets/styles/PlayModeChange.module.scss'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';


const PlayModeChange = (props) => {
    const [value, setValue] = useState("");
    const [err, setErr] = useState("");
    const [data, setData] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setErr("");
        }, 1500);
        return () => clearTimeout(timer);
    }, [err])

    // 一時的に非表示
    const visible = true;
    if (!visible) return null;

    const handleChange = (mode) => {
        props.setPlayMode(mode);
        props.setPlayModeChangeShow(false);
        console.log("モードを変更しました。", mode)
    }

    const ValidationCheck = () => {
        if (!value) {
            setErr("コードを入力してください");
        } else {
            setErr("");
        }
    }

    const handleConnect = async () => {
        ValidationCheck();
        console.log("接続")
        if (value === "") return;

        fetchData();
    }

    const handleNewCreate = () => {
        ValidationCheck();
        console.log("新規作成")
        if (value === "") return;

    }

    const fetchData = async () => {
        try {
            const messageDocRef = doc(db, "ox-game", value);
            const messageDocSnapshot = await getDoc(messageDocRef);

            if (messageDocSnapshot.exists()) {
                const data = messageDocSnapshot.data();
                console.log("取得しました。", data);
                setData(data);
            } else {
                setErr("部屋が存在しません");

            }
        } catch {
            setErr("取得できませんでした");
        }
    };

    return (
        <>
            <div className={style.playChange} onClick={() => props.setPlayModeChangeShow(true)}>
                <div className={`text-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" strokeWidth="2.5" stroke="black" fill="none" ><circle cx="22.83" cy="22.57" r="7.51"></circle><path d="M38 49.94a15.2 15.2 0 00-15.21-15.2h0a15.2 15.2 0 00-15.2 15.2z"></path><circle cx="44.13" cy="27.22" r="6.05"></circle><path d="M42.4 49.94h14A12.24 12.24 0 0044.13 37.7h0a12.21 12.21 0 00-5.75 1.43"></path></svg>
                </div>
                <div className={style.changeText}>モード変更</div>
            </div>
            {/*  モーダル */}
            <Modal show={props.playModeChangeShow} onHide={() => props.setPlayModeChangeShow(false)} size='sm'>
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
                    <Button variant="secondary" className='w-100' onClick={() => props.setPlayModeChangeShow(false)}>
                        閉じる
                    </Button>
                </Modal.Footer>
            </Modal >
            {/* 接続 */}
            <Modal show={props.connectModalShow} onHide={() => props.setConnectModalShow(false)} size='sm'>
                <Modal.Header closeButton>
                    <Modal.Title>オンラインに接続</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <InputGroup className="mb-3">
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                placeholder="コードを入力"
                                required
                                className='text-center'
                                onChange={(e) => setValue(e.target.value)}
                                value={value}
                            />
                        </InputGroup>
                        <div className={style.connectBtn}>
                            <Button className='w-100' type='submit' onClick={handleConnect}>接続</Button>
                            <Button className='w-100' type='submit' onClick={handleNewCreate}>新規作成</Button>
                        </div>
                        <div className='small text-center mt-1' style={{ color: "red" }}>{err ? (err) : ("　")}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='w-100' onClick={() => props.setConnectModalShow(false)}>
                        閉じる
                    </Button>
                </Modal.Footer>
            </Modal >
        </>

    )
}

PlayModeChange.propTypes = {
    setPlayMode: PropTypes.func,
    setPlayModeChangeShow: PropTypes.func,
    setConnectModalShow: PropTypes.func,
    playModeChangeShow: PropTypes.bool,
    connectModalShow: PropTypes.bool,
};

export default PlayModeChange
