import {createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState,} from "react";
import IPiece, {PieceColor} from "./types/IPiece";
import {getColorFromId, moves} from "./Utility";

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
    selectedPiece: string,

    getPieces: () => IPiece[],
    getColorPieces: (black: boolean) => IPiece[],
    getSelectedPiecePosition: () => number,

    setPieces: (pieces: IPiece[]) => void,
    setSelectedPiece: (id: string) => void,
    changePosition: (id: string, newPosition: number) => void,
    moveSelectedPiece: (newPosition: number) => void,

    setHighlightedPositions: (n: number[]) => void
    highlightedPositions: number[]

    canDrag: (id: string) => boolean
}

export const ChessContext = createContext<ChessContextType>(
    invariantViolation(new Error("TasksContextProvider is not defined"))
);

export const useChess = () => useContext(ChessContext);

export const ChessProvider: FC<PropsWithChildren<{}>> = ({children}) => {
    const [pieces, setPieces] = useState<IPiece[]>([]);
    const [selectedPiece, setSelectedPiece] = useState("");
    const [highlightedPositions, setHighlightedPositions] = useState<number[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState(PieceColor.white)

    const switchPlayer = useCallback(() => {
        setCurrentPlayer((prev) => prev === PieceColor.white ? PieceColor.black : PieceColor.white);
    }, [currentPlayer])

    const getPieces = () => pieces;
    const getColorPieces = (black: boolean) => pieces.filter(p =>
        (p.pieceColor == PieceColor.black && black) ||
        (p.pieceColor == PieceColor.white && !black))
    const getSelectedPiecePosition = () => {
        if (selectedPiece === "") {
            return -1;
        }
        return pieces.find(p => p.id === selectedPiece)!.position;
    }

    const getPiecePosition = (id: string) => {
        debugger
        return pieces.find(p => p.id === id)?.position ?? -1
    };
    const getPieceById = (id: string) => pieces.find(p => p.id === id)!

    const changePosition = (id: string, newPosition: number) => {
        const newP = pieces.find(p => p.id === id)!;
        if (newP.pieceColor != currentPlayer) {
            return
        }
        setPieces(pieces
            .filter(p => p.position !== newPosition)
            .map((p) => p.id === id ? {...p, position: newPosition} : p)
        );
        setHighlightedPositions([]);
        switchPlayer();
    }

    const moveSelectedPiece = (newPosition: number) => {
        if (selectedPiece == "") {
            return;
        }
        changePosition(selectedPiece, newPosition);
        setSelectedPiece("");
    }

    const setPiecesExt = (newPieces: IPiece[]) => setPieces(newPieces);
    const setSelectedPieceExt = useCallback((id: string) => {
        if (id.at(id.length - 1) != currentPlayer) {
            return;
        }
        if (id === selectedPiece) {
            setSelectedPiece("");
            setHighlightedPositions([]);
            return
        }
        setSelectedPiece(id);
        const position = getPiecePosition(id);
        const piece = getPieceById(id);
        setHighlightedPositions([position].concat(moves(piece)));
    }, [currentPlayer, getPiecePosition])

    const canDrag = (id: string): boolean => {
        return getColorFromId(id) === currentPlayer;
    }

    return <ChessContext.Provider value={{
        pieces,
        selectedPiece,
        getPieces,
        getColorPieces,
        getSelectedPiecePosition,
        changePosition,
        moveSelectedPiece,
        setPieces: setPiecesExt,
        setSelectedPiece: setSelectedPieceExt,

        highlightedPositions,
        setHighlightedPositions,

        canDrag
    }}>
        {children}
    </ChessContext.Provider>
}