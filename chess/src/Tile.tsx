import styled from "styled-components";
import Piece from "./Piece";
import IPiece from "./types/IPiece";
import {useChess} from "./ChessContext";
import {useDrop} from "react-dnd";

const getBackgroundColor = (dark: boolean, highlighted: boolean) => {
    const vals = {
        "true,true": "lightblue",
        "true,false": "darkgray",
        "false,true": "lightblue",
        "false,false": "white"
    }
    return vals[`${dark},${highlighted}`];
}

const TileContainer = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
`

interface TileProps {
    black: boolean
    piece?: IPiece
    highLighted: boolean,
    i: number
}

const Tile = ({black, piece, highLighted, i}: TileProps) => {
    const {changePosition, pieces, moveSelectedPiece, getSelectedPiecePosition} = useChess();

    const [{canDrop}, drop] = useDrop(
        () => ({
            accept: 'PIECE',
            canDrop: () => true,
            drop: (d: {id: string}, monitor) => {
                if (getSelectedPiecePosition() != i) {
                    changePosition(d.id, i)
                }
            },
            collect: (m_) => {
                return {canDrop: m_.canDrop()};
            }
        }),

        [pieces]
    )


    const color = canDrop ? 'blue' : getBackgroundColor(black,highLighted)


    return <TileContainer ref={drop}
                          color={color} onClick={() => moveSelectedPiece(i)}>
        {i}
        {piece && <Piece {...piece}/>}
    </TileContainer>
}

export default Tile
