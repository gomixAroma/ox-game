import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import style from './../assets/styles/PlayModeChange.module.scss'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { db } from '../api/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';


const PlayModeChange = forwardRef(function PlayModeChange(props, ref) {
    useImperativeHandle(ref, () => {

    });


    const [value, setValue] = useState("");
    const [err, setErr] = useState("");
    const [data, setData] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setErr("");
        }, 1500);
        return () => clearTimeout(timer);
    }, [err]);


    useEffect(() => {
        SetTurn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleChange = (mode) => {
        props.setPlayMode(mode);
        props.setPlayModeChangeShow(false);
        console.log("モードを変更しました。", mode)
    }

    let End = false;
    const ValidationCheck = () => {
        End = false;
        if (!value) {
            End = true;
            setErr("コードを入力してください");
        } else if (value.length < 8) {
            End = true;
            setErr("コードは8文字以上で入力してください");
        } else {
            setErr("");
        }
    }

    const SET = () => {
        console.log("run");
        props.setIsConnect(true);
        props.setRoomPass(value);
        props.setConnectModalShow(false);
    }

    const SetTurn = async () => {
        const DocRef = doc(db, "ox-game", value);
        try {
            if (!data.X) {
                await updateDoc(DocRef, {
                    X: true,
                });
                props.setOnlineTurn("X");
            } else if (!data.O) {
                await updateDoc(DocRef, {
                    O: true,
                });
                props.setOnlineTurn("O");
            } else {
                setErr("定員に達しています。");
            }
        } catch {
            setErr("不明なエラーが発生しました。");
        }
    }

    const handleConnect = async () => {
        ValidationCheck();
        if (End) return;
        setData("");

        fetchData();

        SET();
    }

    const handleNewCreate = async () => {
        ValidationCheck();
        if (End) return;
        setData("");

        const DocRef = doc(db, "ox-game", value);
        const DocSnapshot = await getDoc(DocRef);

        if (DocSnapshot.exists()) {
            setErr("すでに存在します");
            return;
        }

        const startPlayer = Math.floor(Math.random() * 2) === 0 ? "X" : "O";
        try {
            await setDoc(doc(db, "ox-game", value), {
                squares: Array(9).fill(null),
                startPlayer: startPlayer,
                turn: startPlayer,
                winner: null,
                date: new Date().toLocaleString(),
                X: false,
                O: false,
            });
            setErr("新規作成しました");
            props.setConnectModalShow(false);
        } catch {
            setErr("作成できませんでした");
            return;
        }

        fetchData();

        SET();
    }

    const fetchData = async () => {
        try {
            const DocRef = doc(db, "ox-game", value);
            const DocSnapshot = await getDoc(DocRef);

            if (DocSnapshot.exists()) {
                const data = DocSnapshot.data();
                setData(data);
                return "success";
            } else {
                setErr("部屋が存在しません");
                return "error_not_found";
            }
        } catch {
            setErr("取得できませんでした");
            return "error";
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
})

PlayModeChange.propTypes = {
    setPlayMode: PropTypes.func,
    setPlayModeChangeShow: PropTypes.func,
    setConnectModalShow: PropTypes.func,
    playModeChangeShow: PropTypes.bool,
    connectModalShow: PropTypes.bool,
    setOnlineTurn: PropTypes.func,
    setIsConnect: PropTypes.func,
    setRoomPass: PropTypes.func,
};

export default PlayModeChange
