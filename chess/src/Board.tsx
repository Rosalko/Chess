import styled from "styled-components";
import Tile from "./Tile";
import {useChess} from "./ChessContext";
import {PieceColor, PieceType} from "./types/IPiece";
import piece from "./Piece";
import {useEffect} from "react";
import defaultGame from "./baseStance";
import {bishopMoves, boardFromFen, rookMoves} from "./Utility";

const Container = styled.div`
  display: grid;
  border: 1px solid green;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
`
const getTileColor = (index: number) => (index % 2 != Math.floor(index / 8) % 2);


const Board = () => {
    const tiles = Array(64).fill(0).map((_, i) => i);
    const {pieces, setPieces, highlightedPositions, ddd} = useChess();

    const defaultState = defaultGame;
    useEffect(() => {
        setPieces(boardFromFen( "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"))
    }, [])


    return <Container>
        {tiles.map(i =>
            <Tile key={i}
                  black={getTileColor(i)}
                  i={i}
                  piece={pieces.find(p => p.position === i)}
                  highLighted={highlightedPositions.filter(p => p === i).length !== 0}/>
        )
        }
    </Container>
}

export default Board