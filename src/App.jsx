import './App.scss'
import Square from './components/Square'
import style from './assets/styles/Square.module.scss'
import React, { useEffect, useState } from 'react';
import Turn from './components/Turn';
import { Button } from 'react-bootstrap';
import ResetAlertModal from './components/ResetAlertModal';
// import confetti from 'canvas-confetti'
import WinnerModal from './components/WinnerModal';
import { useReward } from "react-rewards";
import WinnerLogModal from './components/WinnerLogModal';
import PlayModeChange from './components/PlayModeChange';
import onlineSVG from "./assets/images/SVG/online.svg";

export const WinnerContext = React.createContext("");

function App() {
  const [playMode, setPlayMode] = useState("offline");
  const [clickDisable, setClickDisable] = useState(false);

  const [shakes, setShakes] = useState(["", "", "", "", "", "", "", "", ""]);
  const [squares, setSquares] = useState(["", "", "", "", "", "", "", "", ""]);
  const [squareRemove, setSquareRemove] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [winner, setWinner] = useState(null);
  const [logMode, setLogMode] = useState(false);

  const startPlayer = Math.floor(Math.random() * 2) === 0 ? "X" : "O";
  const [turn, setTurn] = useState(startPlayer);

  // モーダル関連
  const [resetModalShow, setResetModalShow] = useState(false);
  const [winnerModalShow, setWinnerModalShow] = useState(false);
  const [winnerLogModalShow, setWinnerLogModalShow] = useState(false);
  // End

  // プレイモード変更
  const [playModeChangeShow, setPlayModeChangeShow] = useState(false);
  const [connectModalShow, setConnectModalShow] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      } else if (X.includes(winPattern[i][0]) && X.includes(winPattern[i][1]) && X.includes(winPattern[i][2])) {
        setWinner("X");
      }
    }
  };

  // マスをクリック
  const handleClick = (i) => {
    if (winner || clickDisable) return;

    if (squares[i] === "") {
      const newSquares = squares.slice();
      newSquares[i] = turn;

      const newSquareRemove = squareRemove.slice();
      newSquareRemove[i] = 7;

      for (let r = 0; r < squareRemove.length; r++) {
        newSquareRemove[r] = newSquareRemove[r] - 1;
      }

      setSquares(newSquares);
      setSquareRemove(newSquareRemove);

      for (let j = 0; j <= 8; j++) {
        if (newSquareRemove[j] === 0) {
          const newSquares2 = newSquares.slice();
          newSquares2[j] = "";
          setSquares(newSquares2);
        }
      }

      if (turn === "X") {
        setTurn("O");
      } else if (turn === "O") {
        setTurn("X");
      }

    } else {
      const newShakes = shakes.slice();
      newShakes[i] = "shake";
      setShakes(newShakes);
    }
  };

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
  }, [shakes])

  useEffect(() => {
    handleSquareReset("reset");
    if (playMode === "online") {
      setClickDisable(true);
    } else {
      setClickDisable(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playMode])

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

  const handleBack = () => {
    history.replaceState(null, '', url.pathname);
    window.location.reload();
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
          <div className={style.top}>
            <div className={style.title} aria-label='タイトル'>
              <div className='d-flex'>
                <span>三目並べ</span>
                <img src={onlineSVG} alt="オンラインモード" className={playMode === "offline" ? "invisible" : "visible"} width={40} style={{ marginLeft: "5px", }} />
              </div>
              <span aria-label='モード:'>{playMode === "offline" ? "オフライン" : "オンライン"}</span>
            </div>
            {/* 履歴を見るときはターンではなく勝者を表示 */}
            <Turn turn={turn} logMode={logMode} winner={winner} />
          </div>
          {/* ゲーム盤 */}
          <div className={style.row}>
            <Square i={0} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
            <Square i={1} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
            <Square i={2} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
          </div>
          <div className={style.row}>
            <Square i={3} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
            <Square i={4} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
            <Square i={5} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
          </div>
          <div className={style.row}>
            <Square i={6} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
            <Square i={7} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
            <Square i={8} shakes={shakes} turn={turn} squareRemove={squareRemove} handleClick={handleClick} squares={squares} setSquares={setSquares} />
          </div>
          {/* 履歴を見るときはボタンを非表示 */}
          {logMode || playMode === "online" ? (
            <div className={`w-100 ${playMode === "online" && ("d-none")}`}>
              <Button className='mt-2 w-100' onClick={handleBack}>戻る</Button>
            </div>
          ) : (
            <div className='w-100'>
              <Button variant='primary' className='mt-2 w-100' onClick={() => winner ? (handleSquareReset("reset")) : (handleSquareReset("check"))}>マスをリセット</Button>
              <Button className='mt-2 w-100' onClick={() => setWinnerLogModalShow(true)}>勝敗を見る</Button>
            </div>
          )}
          {playMode === "online" && (
            <div className='w-100'>
              <Button className='mt-2 w-100' onClick={() => setConnectModalShow(true)}>オンラインに接続</Button>
            </div>
          )}
        </div >
        {/* 紙吹雪 */}
        <div aria-hidden="true" aria-label='紙吹雪' className={style.confetti} >
          <div id='reward' />
        </div>
      </div >

      {/* ここでオンラインモードとかに切り替えられるようにしたい */}
      {/*  一時的に非表示中 */}
      <PlayModeChange
        playMode={playMode}
        setPlayMode={setPlayMode}
        playModeChangeShow={playModeChangeShow}
        setPlayModeChangeShow={setPlayModeChangeShow}
        connectModalShow={connectModalShow}
        setConnectModalShow={setConnectModalShow}
      />

      <ResetAlertModal
        show={resetModalShow}
        handleAgree={() => handleSquareReset("reset")}
        onHide={() => setResetModalShow(false)} />
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
