import React from "react";
import PlayerBoard from "./PlayerBoard";
import Game from "../Game";
import {useParams} from "react-router-dom";

class PlayerGame extends Game {
    constructor(props) {
        super(props);

        const { player1, player2 } = useParams();
        this.player1 = new Player({username: player1, pointerId: 0})
        this.player2 = new Player({username: player2, pointerId: 0})

        this.state = {
            squares: Array(9).fill(null),
            playerTurn: 0,
        };
    }

    async handleClick() {
        const nextSquares = this.state.squares.slice();
        await super.handlePlay(nextSquares);

        this.setState({
            squares: nextSquares,
            playerTurn: 1,
        });
    }

    render() {
        return (
            <div>
                {super.render()}
                <div className="game-board">
                    <PlayerBoard
                        player1={this.player1}
                        player2={this.player2}
                        squares={this.state.squares}
                        onPlay={(nextSquares) => this.handlePlay(nextSquares)}
                    />
                </div>
            </div>
        );
    }
}

export default PlayerGame;