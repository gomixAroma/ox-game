import './App.scss'
import style from './assets/styles/Square.module.scss'
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import ResetAlertModal from './components/ResetAlertModal';
import WinnerModal from './components/WinnerModal';
import { useReward } from "react-rewards";
import WinnerLogModal from './components/WinnerLogModal';
import PlayModeChange from './components/PlayModeChange';
import SquaresBox from './components/SquaresBox';
import Head from './components/Head';
import PlayerWaiting from './components/PlayerWaiting';

import { db } from './api/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { DeleteDocument, OnlineBoardAndRemoveUpdate, OnlineDisconnect, OnlineTurnChange } from './api/OnlineFunctions';
import OXmark from './components/OXmark';

export const WinnerContext = React.createContext("");

function App() {
  const onlineMark = useRef(null);

  //仮
  const visible = true;

  const startPlayer = Math.floor(Math.random() * 2) === 0 ? "X" : "O";
  const [turn, setTurn] = useState(startPlayer);

  const [shakes, setShakes] = useState(["", "", "", "", "", "", "", "", ""]);
  const [squares, setSquares] = useState(["", "", "", "", "", "", "", "", ""]);
  const [squareRemove, setSquareRemove] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [winner, setWinner] = useState(null);
  const [logMode, setLogMode] = useState(false);
  const [clickDisable, setClickDisable] = useState(false);

  // モーダル関連
  const [resetModalShow, setResetModalShow] = useState(false);
  const [winnerModalShow, setWinnerModalShow] = useState(false);
  const [winnerLogModalShow, setWinnerLogModalShow] = useState(false);
  // プレイモード変更
  const [playMode, setPlayMode] = useState("offline");
  const [playModeChangeShow, setPlayModeChangeShow] = useState(false);
  const [connectModalShow, setConnectModalShow] = useState(false);

  //オンラインモードのState
  const [onlineTurn, setOnlineTurn] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const [roomPass, setRoomPass] = useState("");
  const [onlinePlayerMark, setOnlinePlayerMark] = useState("");
  const [data, setData] = useState(null);
  const [onlineWinner, setOnlineWinner] = useState(null);

  const { reward } = useReward("reward", "confetti", { spread: 100, zIndex: 1000, elementCount: 200 });

  const winPattern = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  const [date_param_state, setDateParam] = useState(null);

  //履歴閲覧
  const url = new URL(window.location.href);
  useEffect(() => {
    const squares_param = url.searchParams.get("squares");
    const winner_param = url.searchParams.get("winner");
    const date_param = url.searchParams.get("date");
    setDateParam(url.searchParams.get("date"));
    if (squares_param && winner_param && date_param) {
      setLogMode(true);
      setSquareRemove([100, 100, 100, 100, 100, 100, 100, 100, 100]);
      setSquares(squares_param.split(","));
      setWinner(winner_param);
    }

    //パラメーターによってオンラインにするかオフラインにするかを切り替える
    const playMode_param = url.searchParams.get("mode");
    if (playMode_param === "online") {
      setPlayMode("online")
    } else {
      setPlayMode("offline")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // shakeを解除
  useEffect(() => {
    const timer = setTimeout(() => {
      const newShakes = shakes.slice();
      for (let i = 0; i <= 8; i++) {
        newShakes[i] = "";
      }
      setShakes(newShakes);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shakes]);

  // 勝敗判定
  useEffect(() => {
    if (logMode) return;
    CheckWinner(squares);

    // 勝者が決まったらモーダルを表示
    //紙吹雪を出す
    //localStorageに保存
    if (!winner) return;
    const date = new Date();
    if (!localStorage.getItem("OXwinnerLog")) {
      const winnerData = [
        {
          winner: winner,
          squares: squares,
          date: date.toLocaleString(),
        },
      ]
      localStorage.setItem("OXwinnerLog", JSON.stringify(winnerData));
    } else {
      const winnerData = {
        winner: winner,
        squares: squares,
        date: date.toLocaleString(),
      }
      const winnerLog = JSON.parse(localStorage.getItem("OXwinnerLog"));
      winnerLog.push(winnerData);
      localStorage.setItem("OXwinnerLog", JSON.stringify(winnerLog));
    }

    setWinnerModalShow(true);
    //紙吹雪を出す
    reward();
    setTimeout(() => { reward(); }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squares, winner]);

  useEffect(() => {
    handleSquareReset("reset");
    if (playMode === "online") {
      setClickDisable(true);
    } else {
      setClickDisable(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playMode]);


  //勝敗を判定
  const CheckWinner = (squares) => {
    const O = [];
    const X = [];
    for (var o = 0; o <= 8; o++) {
      if (squares[o] === "O") {
        O.push(o);
      }
    }

    for (var x = 0; x <= 8; x++) {
      if (squares[x] === "X") {
        X.push(x);
      }
    }

    for (let i = 0; i < winPattern.length; i++) {
      if (O.includes(winPattern[i][0]) && O.includes(winPattern[i][1]) && O.includes(winPattern[i][2])) {
        setWinner("O");
        if (playMode === "online") setOnlineWinner("O");
      } else if (X.includes(winPattern[i][0]) && X.includes(winPattern[i][1]) && X.includes(winPattern[i][2])) {
        setWinner("X");
        if (playMode === "online") setOnlineWinner("X");
      }
    }
  };

  // マスをクリック
  const handleClick = async (i) => {
    if (winner || clickDisable) return;

    if (squares[i] === "") {
      const newSquares = squares.slice();
      newSquares[i] = playMode === "offline" ? turn : onlinePlayerMark;

      const newSquareRemove = squareRemove.slice();
      newSquareRemove[i] = 7;

      for (let r = 0; r < squareRemove.length; r++) {
        let minus;
        if (playMode === "offline") {
          minus = 1;
        } else {
          minus = 1;
        }
        newSquareRemove[r] = newSquareRemove[r] - minus;
      }

      var onlineNewSquares;
      onlineNewSquares = newSquares;
      setSquares(newSquares);
      setSquareRemove(newSquareRemove);

      //0のマスを消す
      for (let j = 0; j <= 8; j++) {
        if (newSquareRemove[j] === 0) {
          const newSquares2 = newSquares.slice();
          newSquares2[j] = "";
          onlineNewSquares = newSquares2;
          setSquares(newSquares2);
        }
      }

      if (turn === "X" && playMode === "offline") {
        setTurn("O");
      } else if (turn === "O" && playMode === "offline") {
        setTurn("X");
      }

      //オンラインのとき、firebaseに盤面とマーク削除を送信
      if (playMode === "online") {
        OnlineBoardAndRemoveUpdate(roomPass, data, onlineNewSquares, newSquareRemove);
      }
    } else {
      const newShakes = shakes.slice();
      newShakes[i] = "shake";
      setShakes(newShakes);
    }

    //オンランインのターンを変更する
    if (isConnect && playMode === "online") OnlineTurnChange(roomPass, data);
  };

  // マスをリセット
  const handleSquareReset = (mode) => {
    switch (mode) {
      case "check":
        setResetModalShow(true);
        break;
      case "reset":
        setShakes(["", "", "", "", "", "", "", "", ""]);
        setSquares(["", "", "", "", "", "", "", "", ""]);
        setSquareRemove([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setWinner(null);
        setTurn(startPlayer);
        // モーダルを閉じる
        setResetModalShow(false);
        break;
      default:
        //握りつぶす リセットを実行
        handleSquareReset("reset");
        break;
    }
  };

  const handleBack = () => {
    history.replaceState(null, '', url.pathname);
    window.location.reload();
  }

  const ConnectAndDisconnect = () => {
    if (!isConnect) {
      setConnectModalShow(true);
    } else {
      //切断処理
      OnlineDisconnect(roomPass, onlineMark.current);

      //削除処理
      if (onlineMark.current === "X" && !data.O) {
        DeleteDocument(roomPass);
      } else if (onlineMark.current === "O" && !data.X) {
        DeleteDocument(roomPass);
      }

      setIsConnect(false);
      setRoomPass("");
      setOnlineTurn(null);
      setData(null);
      setOnlinePlayerMark("");
      handleSquareReset("reset");
      setOnlineWinner(null);
    }
  }

  function RealTimeUpdate(value) {
    // eslint-disable-next-line no-unused-vars
    const unsub = onSnapshot(doc(db, "ox-game", value), (doc) => {
      setData(doc.data());
      //OnlineFunctions.js
      GameUpdate(doc.data());
    });
  }

  useEffect(() => {
    onlineMark.current = onlinePlayerMark;
  }, [onlinePlayerMark, squares]);

  //firebase上のデータが更新されたときに発火する関数
  function GameUpdate(data) {
    if (!data) return;
    if (!data.X || !data.O) {
      setClickDisable(true);
      return
    }
    if (onlineMark.current === data.turn) {
      setClickDisable(false);
    } else {
      setClickDisable(true);
    }

    setSquares(data.board);
    setSquareRemove(data.boardRemove);

    setOnlineTurn(data.turn);
  }

  return (
    <>
      <div className={`App`}>
        <div className={style.wrap}>
          {/* タイトル */}
          {logMode && (
            <div className='text-center'>
              <div>プレイした日時</div>
              <div>{date_param_state}</div>
            </div>
          )}
          {/* タイトル,ターン表示 */}
          <Head
            playMode={playMode}
            onlineTurn={onlineTurn}
            turn={turn}
            logMode={logMode}
            winner={winner}
            onlinePlayerMark={onlinePlayerMark}
          />
          {/* ゲーム盤 */}
          <SquaresBox
            shakes={shakes}
            turn={turn}
            squareRemove={squareRemove}
            handleClick={handleClick}
            squares={squares}
            setSquares={setSquares}
          />
          {/* 履歴を見るときはボタンを非表示 */}
          {logMode || playMode === "online" ? (
            <div className={`w-100 ${playMode === "online" && ("d-none")}`}>
              <Button
                className='mt-2 w-100'
                onClick={handleBack}
              >戻る</Button>
            </div>
          ) : (
            <div className='w-100'>
              <Button
                variant='primary'
                className='mt-2 w-100'
                onClick={() => winner ? (handleSquareReset("reset")) : (handleSquareReset("check"))}
              >マスをリセット</Button>
              <Button
                className='mt-2 w-100'
                onClick={() => setWinnerLogModalShow(true)}
              >勝敗を見る</Button>
            </div>
          )}
          {playMode === "online" && (
            <div className='w-100'>
              <Button
                className='mt-2 w-100'
                onClick={() => ConnectAndDisconnect()}
              >{isConnect ? "切断" : "オンラインに接続"}</Button>
              <div style={{ textAlign: "center", marginTop: "3px" }} className='d-flex justify-content-center align-items-center'>
                {roomPass && !onlineWinner && (<>コード : <span style={{ userSelect: "all" }}>{roomPass}</span></>)}
                {onlineWinner && (<><OXmark mark={onlineWinner} width={20} /><span>が勝ちました</span></>)}
              </div>
            </div>
          )}
        </div>
        {playMode === "online" && isConnect && !onlineWinner && (
          <PlayerWaiting data={data} />
        )}
      </div >


      {visible && (
        <>
          <PlayModeChange
            playMode={playMode}
            setPlayMode={setPlayMode}
            playModeChangeShow={playModeChangeShow}
            setPlayModeChangeShow={setPlayModeChangeShow}
            connectModalShow={connectModalShow}
            setConnectModalShow={setConnectModalShow}
            setOnlineTurn={setOnlineTurn}
            setIsConnect={setIsConnect}
            setRoomPass={setRoomPass}
            setOnlinePlayerMark={setOnlinePlayerMark}
            setData={setData}
            RealTimeUpdate={RealTimeUpdate}
          />
        </>
      )}

      <ResetAlertModal
        show={resetModalShow}
        handleAgree={() => handleSquareReset("reset")}
        onHide={() => setResetModalShow(false)}
      />
      <WinnerContext.Provider value={winner}>
        <WinnerModal
          show={winnerModalShow}
          onHide={() => setWinnerModalShow(false)}
          backdropClassName='winner-modal-backdrop'
          contentClassName='winner-modal-content'
        />
      </WinnerContext.Provider>
      <WinnerLogModal
        show={winnerLogModalShow}
        handleClose={() => setWinnerLogModalShow(false)}
      />
    </ >
  )
}

export default App;
