import { createRef, useEffect, useState } from 'react';
import style from './../assets/styles/PlayModeChange.module.scss'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { db } from '../api/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';


const PlayModeChange = (props) => {
    const [value, setValue] = useState("");
    const [err, setErr] = useState("");
    const ref = createRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setErr("");
        }, 1500);
        return () => clearTimeout(timer);
    }, [err]);

    useEffect(() => {
        if (props.connectModalShow) {
            ref.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.connectModalShow])

    const handleChange = (mode) => {
        props.setPlayMode(mode);
        props.setPlayModeChangeShow(false);
    }

    const handleConnect = async () => {
        if (CheckValidation()) return;
        if (!await CheckRoom()) {
            setErr("存在しないコードです");
            return;
        }
        const DocRef = doc(db, "ox-game", value);
        const docSnapshot = await getDoc(DocRef);
        const data = docSnapshot.data();
        if (data.X && data.O) {
            setErr("すでに満員です");
            return;
        }
        props.setIsConnect(true);
        Setting();
    }

    const handleNewCreate = async () => {
        if (CheckValidation()) return;
        if (await CheckRoom()) {
            setErr("すでに存在するコードです");
            return;
        }
        const DocRef = doc(db, "ox-game", value);
        const startTurn = Math.floor(Math.random() * 2) === 0 ? "X" : "O";
        await setDoc(DocRef, {
            date: new Date().toLocaleString(),
            "startTurn": startTurn,
            "turn": startTurn,
            "board": Array(9).fill(""),
            "boardRemove": Array(9).fill(""),
            // "winner": null,
            "X": null,
            "O": null,
        });
        props.setIsConnect(true);
        Setting();
    }

    function CheckValidation() {
        let err;
        if (!value) {
            err = "コードを入力してください"
        } else if (!/^[a-zA-Z0-9]*$/.test(value)) {
            err = "半角英数字で入力してください";
        } else if (value.length < 8) {
            err = "コードは8文字以上で入力してください";
        } else if (value.length > 20) {
            err = "コードは20文字以下で入力してください";
        } else {
            err = "";
        }
        if (err) {
            setErr(err);
            return true;
        }
        return false;
    }

    async function CheckRoom() {
        const roomRef = doc(db, "ox-game", value);
        const docSnap = await getDoc(roomRef);
        return docSnap.exists();
    }

    async function Setting() {
        const DocRef = doc(db, "ox-game", value);
        const docSnapshot = await getDoc(DocRef);
        const data = docSnapshot.data();
        props.setRoomPass(value);
        props.setOnlineTurn(data.turn);

        try {
            if (data.X && data.O) {
                setErr("すでに満員です");
                return;
            } else if (!data.X) {
                await updateDoc(DocRef, {
                    X: true,
                });
                props.setOnlinePlayerMark("X");
            } else if (!data.O) {
                await updateDoc(DocRef, {
                    O: true,
                });
                props.setOnlinePlayerMark("O");
            }
            props.setConnectModalShow(false);

            const updatedDocSnapshot = await getDoc(DocRef); // 変数名を変更
            const updatedData = updatedDocSnapshot.data(); // 変数名を変更
            props.setData(updatedData);
        } catch (e) {
            console.error(e);
            setErr("エラーが発生しました");
            return;
        }

        props.RealTimeUpdate(value);
        setValue("");
    }

    function handleCodeRandom() {
        let code = "";
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 12; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setValue(code);
    }


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
                        <InputGroup className={`mb-3 ${style.input}`}>
                            <Form.Control
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                placeholder="コードを入力"
                                required
                                className={`text-center`}
                                onChange={(e) => setValue(e.target.value)}
                                value={value}
                                ref={ref}
                            />
                            <Button onClick={handleCodeRandom} title="コードを自動生成します">生成</Button>
                        </InputGroup>
                        <div aria-label='エラーテキスト' className={`${style.errText} ${err && style.errShow}`} >{err}</div>
                        <div className={style.connectBtn}>
                            <Button className='w-100' type='submit' onClick={handleConnect}>接続</Button>
                            <Button className='w-100' type='submit' onClick={handleNewCreate}>新規作成</Button>
                        </div>
                        {/* <div className='small text-center mt-1' style={{ color: "red" }}>{err ? (err) : ("")}</div> */}
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
    setOnlineTurn: PropTypes.func,
    setIsConnect: PropTypes.func,
    setRoomPass: PropTypes.func,
    playMode: PropTypes.string,
    onlineTurn: PropTypes.string,
    setOnlinePlayerMark: PropTypes.func,
    setData: PropTypes.func,
    RealTimeUpdate: PropTypes.func,
};

export default PlayModeChange
