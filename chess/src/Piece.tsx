import {useDrag} from "react-dnd";
import styled from "styled-components";
import IPiece, {PieceColor} from "./types/IPiece";

const PieceW = styled.div`
  width: 50%;
  height: 50%;
  color: ${p => p.color}
`

const Piece = ({pieceType, pieceColor}: IPiece) => {
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'PIECE',
        item: {type: pieceType, id: "0nd"},
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging()
            }
        }
    }))
    let color = pieceColor == PieceColor.black ? 'darkgray' : 'lightgray';
    if (isDragging) {
        color = 'yellow'
    }
    return (
        <div role="Handle" ref={drag}>
            <PieceW  color={color} onClick={() => console.log(pieceType)}>
                {pieceType + pieceColor}
            </PieceW>
        </div>)
}

export default Piece;