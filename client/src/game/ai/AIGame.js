import React from "react";
import AIBoard from "./AIBoard";
import Game from "../Game";

class AIGame extends Game {
    constructor(props) {
        super(props);
        this.username = JSON.parse(localStorage.getItem('user'));
        this.selectedPointer = props.selectedPointer;
        this.state = {
            squares: Array(9).fill(null),
            selectedPointer: 0,
            playerTurn: 0,
        };
    }

    async handleClick() {
        const nextSquares = this.state.squares.slice();
        await super.handlePlay(nextSquares);

        this.setState({
            squares: nextSquares,
            selectedPointer: this.state.selectedPointer === 0 ? 1 : 0,
            playerTurn: 1,
        });
    }

    render() {
        return (
            <div>
                {super.render()}
                <div className="game-board">
                    <AIBoard
                        username={this.username}
                        selectedPointer={this.selectedPointer}
                        squares={this.state.squares}
                        onPlay={(nextSquares) => this.handlePlay(nextSquares)}
                    />
                </div>
                <div className="pointer-select">
                    <h1>Select a pointer:</h1>
                    <ol><span className="pointer-id">X <button onClick={() => this.setState({ selectedPointer: 0 })}></button></span></ol>
                    <ol><span className="pointer-id">O <button onClick={() => this.setState({ selectedPointer: 1 })}></button></span></ol>
                </div>
            </div>
        );
    }
}

export default AIGame;