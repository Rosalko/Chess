import styled from "styled-components";
import Tile from "./Tile";
import {useChess} from "./ChessContext";
import {PieceColor, PieceType} from "./types/IPiece";
import piece from "./Piece";
import {useEffect} from "react";

const Container = styled.div`
  display: grid;
  border: 1px solid green;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
`
const getTileColor = (index: number) => (index % 2 != Math.floor(index / 8) % 2);


const Board = () => {
    const tiles = Array(64).fill(0).map((_, i) => i);
    const {pieces, setPieces, changePosition} = useChess();

    useEffect(() => {
        setPieces([{id: "0nd", pieceColor: PieceColor.black, pieceType: PieceType.knight, position: 0}])
    },[])

    return <Container>
        {tiles.map(i =>
            <Tile key={i} black={getTileColor(i)} i={i} piece={pieces.find(p => p.position === i)} onClick={() => {
                changePosition("0nd", i)
            }} />
        )
        }
    </Container>
}

export default Board