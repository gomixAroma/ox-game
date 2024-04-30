import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

//ターンを変更するうやつ
async function OnlineTurnChange(roomPass, data) {
    await updateDoc(doc(db, "ox-game", roomPass), {
        turn: data.turn === "X" ? "O" : "X",
    })
}

async function OnlineBoardAndRemoveUpdate(roomPass, data, onlineNewSquares, newSquareRemove) {
    await updateDoc(doc(db, "ox-game", roomPass), {
        board: onlineNewSquares,
        boardRemove: newSquareRemove,
    })
}

async function OnlineDisconnect(roomPass, onlineMark) {
    if (onlineMark === "X") {
        await updateDoc(doc(db, "ox-game", roomPass), {
            X: false,
        });
    } else if (onlineMark === "O") {
        await updateDoc(doc(db, "ox-game", roomPass), {
            O: false,
        });
    }
}

async function DeleteDocument(value) {
    const docRef = doc(db, 'ox-game', value);

    try {
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error removing document: ', error);
    }
}

export { OnlineTurnChange, OnlineBoardAndRemoveUpdate, OnlineDisconnect, DeleteDocument };
