import styled from "styled-components";
import Piece from "./Piece";
import IPiece from "./types/IPiece";
import {useChess} from "./ChessContext";
import {useDrop} from "react-dnd";

const getBackgroundColor = (dark: boolean, highlighted: boolean) => {
    const values = {
        "true,true": "lightblue",
        "true,false": "darkgray",
        "false,true": "lightblue",
        "false,false": "white"
    }
    return values[`${dark},${highlighted}`];
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
    const {changePosition, pieces, moveSelectedPiece, canDrop} = useChess();

    const [{cD}, drop] = useDrop(
        () => ({
            accept: 'PIECE',
            canDrop: (d: IPiece) => canDrop(d.id, i),
            drop: (d: IPiece, _) => {
                if (d.position != i) {
                    changePosition(d.id, i)
                }
            },
            collect: (m_) => {

                return {cD: m_.canDrop() };
            }
        }),
        [pieces, canDrop]
    )


    const color = cD ? 'blue' : getBackgroundColor(black, highLighted)


    return <TileContainer ref={drop}
                          color={color} onClick={() => moveSelectedPiece(i)}>
        {i}
        {piece && <Piece {...piece}/>}
    </TileContainer>
}

export default Tile
