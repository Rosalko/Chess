import {useDrag, DragPreviewImage} from "react-dnd";
import styled from "styled-components";
import IPiece, {PieceColor} from "./types/IPiece";
import {useChess} from "./ChessContext";

const PieceW = styled.div`
  width: 50%;
  height: 50%;
  color: ${p => p.color}
`

const Piece = ({pieceType, pieceColor, id,position}: IPiece) => {
    const {setSelectedPiece, canDrag} = useChess();
    const [{isDragging}, drag, preview] = useDrag(() => ({
        beginDrag : null,
        canDrag : canDrag(id),
        type: 'PIECE',
        item: () =>
        {
            //TODO since this is a function, this fires in the beginning and I can call for calculation of available moves
            console.log("het")
            return {pieceType,pieceColor, id, position}
        },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging()
            }
        }
    }), [id,canDrag])

    const source = `/pieces/Chess_${pieceType}${pieceColor}t45.svg`
    let color = pieceColor == PieceColor.black ? 'darkgray' : 'lightgray';
    if (isDragging) {
        color = 'yellow'
    }
    return (<>
        <DragPreviewImage connect={preview} src={source}/>
        <div role="Handle" ref={drag}>
            <PieceW ref={drag} color={color} onClick={(e) => {
                e.stopPropagation()
                setSelectedPiece(id)
            }}>
                <img src={source} alt={""}/>
            </PieceW>
        </div>
    </>)
}

export default Piece;