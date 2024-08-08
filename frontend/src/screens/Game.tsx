import { Chess } from "chess.js";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    
    useEffect(() => {
        if(!socket) {
            return;
        }
        
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch(message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    console.log("Game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;   
            }
        }
    }, [socket]);
    
    if(!socket) return <div>Connecting...</div>

    return <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4 w-full flex justify-center">
                    <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board}/>
                </div>
                <div className="col-span-2 flex justify-center pt-8 bg-slate-900">
                    <Button onClick={() => {
                        socket.send(JSON.stringify({
                            type: INIT_GAME
                        }))
                    }}>
                        Play
                    </Button>
                </div>
            </div>
        </div>
    </div>
}