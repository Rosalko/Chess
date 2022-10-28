import IPiece, {PieceColor, PieceType} from "./types/IPiece";

const isWhite = (piece: string): Boolean => {
    return piece === piece.toUpperCase();
}

const getPieceType = (piece: string): PieceType => {
    return piece.toLowerCase() as PieceType;
}

const getColor = (piece: string): PieceColor => {
    return isWhite(piece) ? PieceColor.white : PieceColor.black;
}

export const getColorFromId = (piece: string): PieceColor => {
    return (piece.toLowerCase().at(-1)!) === 'd' ? PieceColor.black : PieceColor.white;
}

const getPiece = (piece: string): IPiece => {
    const pieceColor = getColor(piece);
    const pieceType = getPieceType(piece);
    const position = -1;
    const id = pieceType.toString() + pieceColor.toString();
    return {id, pieceColor, pieceType, position};
}


const isNumeric = (chr: string): Boolean => '0' <= chr && chr <= '9';


export const boardFromFen = (fen: string): IPiece[] => {

    const counts: { [id: string]: number } = {};
    Object.values(PieceType).forEach(pT => {
        Object.values(PieceColor)
            .forEach(pC => {
                counts[pT + pC] = 0;
            })
    })
    console.log(counts);

    const fenRows = fen.split("/");
    let position = 0;
    const result: IPiece[] = []
    fenRows.forEach(row => {
        const chars = row.split('');
        const pieces: IPiece[] = [];
        chars.forEach(chr => {
            if (isNumeric(chr)) {
                position += parseInt(chr);
                return;
            }
            const piece = getPiece(chr);
            const id = piece.id;
            piece.id = counts[id] + id;
            counts[id] += 1;
            piece.position = position;
            position += 1;
            pieces.push(piece);
        })

        result.push(...pieces);

    })


    return result;

}


const range = (start: number, end: number, modifier?: (n: number) => number) => {
    if (!modifier) {
        modifier = (i: number) => i;
    }
    return Array.from({length: (end - start)}, (_, k) => k + start).map(i => modifier!(i));
}

const verticalLine = () => range(1, 8, (n: number) => n * 8)
    .concat(range(1, 8, (n: number) => -n * 8)).sort((a, b) => a - b);

const horizontal = () => range(1, 8)
    .concat(range(1, 8, (n: number) => n * -1)).sort((a, b) => a - b);

const zip = (a: number[], b: number[]) => a.map(function (e, i) {
    return [e, b[i]];
})

const numberAscSort = (a: number, b: number) => a - b;

const diagonalL = () => zip(verticalLine(), horizontal()).map(([a, b]) => a + b);
const diagonalR = () => zip(verticalLine().reverse(), horizontal()).map(([a, b]) => a + b);

export const bishopMoves = () => diagonalL().concat(diagonalR());

export const rookMoves = () => verticalLine().concat(horizontal());

export const queenMoves = () => rookMoves().concat(bishopMoves());

export const pawnMoves = () => range(1, 3, n => 8*n).concat(range(1, 3, n=> -8*n));

export const kingMoves = () => [8, -8, 7, -7, 9, -9, 1, -1];

export const knightMoves = () => zip([8, 8, 16, 16, -8, -8, -16, -16], [-2, 2, -1, 1, -2, 2, -1, 1]).map(([a, b]) => a + b);

const movesByType = (type: PieceType): number[] => {
    switch (type) {
        case PieceType.bishop:
            return bishopMoves();
        case PieceType.rook:
            return rookMoves();
        case PieceType.queen:
            return queenMoves();
        case PieceType.pawn:
            return pawnMoves();
        case PieceType.knight:
            return knightMoves();
        case PieceType.king:
            return kingMoves();
    }
}

export const moves = ({pieceType, position, pieceColor}: IPiece): number[] => {
    let moves = movesByType(pieceType);
    switch (pieceType){
        case PieceType.pawn:
            const comp: (n: number) => boolean = pieceColor === PieceColor.white ? n => n < 0 : n => n > 0;
            moves = moves.filter(comp);
            break
    }
    return moves.map(move => move + position).filter(move => move <= 63 && move >= 0).sort(numberAscSort);
}

type Board = Array<IPiece | null>


const isKingInDanger = (board: Board, color: PieceColor): boolean => {
    const kingPosition = board.findIndex(p => p?.pieceType === PieceType.king && p.pieceColor === color);


    return false;
}

export const getValidMove = (board: Board, movingPiece: IPiece): number[] => {
    const isKingAttacked = isKingInDanger(board, movingPiece.pieceColor);

    return [];
}
