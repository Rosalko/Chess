import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import IPiece, {PieceColor} from "./types/IPiece";

const invariantViolation = (error: Error): any =>
    new Proxy(
        {},
        {
            get(_, __) {
                throw error;
            },
        }
    );

interface ChessContextType {
    pieces: IPiece[],

    getPieces: () => IPiece[],
    getColorPieces: (black: boolean) => IPiece[],

    setPieces: (pieces: IPiece[]) => void,
    changePosition: (id: string, newPosition: number) => void

}

export const ChessContext = createContext<ChessContextType>(
    invariantViolation(new Error("TasksContextProvider is not defined"))
);

export const useChess = () => useContext(ChessContext);

export const ChessProvider: FC<PropsWithChildren<{}>> = ({children}) => {
    const [pieces, setPieces] = useState<IPiece[]>([]);

    const getPieces = () => pieces;
    const getColorPieces = (black: boolean) => pieces.filter(p =>
        (p.pieceColor == PieceColor.black && black) ||
        (p.pieceColor == PieceColor.white && !black))

    const changePosition = (id: string, newPosition: number) => {
        const newP = pieces.find(p => p.id === id)!;
        newP.position = newPosition;
        setPieces(pieces.map((p) => p.id === id ? newP : p))
    }

    const setPiecesExt = (newPieces: IPiece[]) => setPieces(newPieces);

    return <ChessContext.Provider value={{
        pieces,
        getPieces,
        getColorPieces,
        changePosition,
        setPieces: setPiecesExt
    }}>
        {children}
    </ChessContext.Provider>
}