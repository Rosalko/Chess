import styled from "styled-components";
import Piece from "./Piece";
import IPiece from "./types/IPiece";
import {useChess} from "./ChessContext";
import {useDrop} from "react-dnd";

const TileContainer = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: ${props => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
`

interface IdHas{
    id: string
}

interface TileProps {
    black: boolean
    piece?: IPiece
    onClick?: () => void
    i: number
}

const Tile = ({black, piece, onClick, i}: TileProps) => {
    const {changePosition} = useChess();

    const [, drop] = useDrop(
        () => ({
            accept: 'PIECE',
            drop: (d:IdHas, monitor) => {

                changePosition(d.id, i)

                return {bois: 1};
            },
            collect: (m_) => {
                m_.getDropResult();
                return 1
            }
        }),

        []
    )


    return <TileContainer ref={drop}
                          role={'Dustbin'} color={black ? 'black' : 'white'} onClick={onClick}>
        {piece && <Piece {...piece}/>}
    </TileContainer>
}

export default Tile
