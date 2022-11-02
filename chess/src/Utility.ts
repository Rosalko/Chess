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

const boardSize = 8;
const tileNumber = boardSize * boardSize;
const whitePawnRow = 6;
const blackPawnRow = 1;

export const getBoard = (pieces: IPiece[]): Board => {
    return new Array(64).fill(null).map((_, i) => pieces.find(p => p.position === i) ?? null);
}
const getRow = (n: number): number => Math.floor(n / boardSize);
const getColumn = (n: number): number => n % boardSize;

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
const numberDescSort = (a: number, b: number) => b - a;

const diagonalL = () => zip(verticalLine(), horizontal()).map(([a, b]) => a + b);
const diagonalR = () => zip(verticalLine().reverse(), horizontal()).map(([a, b]) => a + b);

export const bishopMoves = () => diagonalL().concat(diagonalR());

export const rookMoves = () => verticalLine().concat(horizontal());

export const queenMoves = () => rookMoves().concat(bishopMoves());

export const pawnMoves = () => [16, -16, 8, -8, 7, -7, 9, -9];

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

type pieceComp = ((n: number) => boolean);

const pawnComp = (row: number, column: number, pieceColor: PieceColor): pieceComp =>
    n => Math.abs(column - getColumn(n)) <= 1 && (pieceColor === PieceColor.white ?
        (row === whitePawnRow && (getRow(n) < row)) || row - getRow(n) === 1 :
        (row === blackPawnRow && getRow(n) > row) || row - getRow(n) === -1);

const rookComp = (row: number, column: number): pieceComp => n => getRow(n) === row || getColumn(n) === column;
const bishopComp = (parity: number): pieceComp => n => (getColumn(n) + getRow(n)) % 2 == parity;
const knightComp = (row: number, column: number): pieceComp => n => Math.abs(getColumn(n) - column) <= 2 && Math.abs(getRow(n) - row) <= 2;
const queenComp = (row: number, column: number): pieceComp => {
    return n => {
        const queenParity = (column + row) % 2;
        const tileRow = getRow(n);
        const tileColumn = getColumn(n);
        const tileParity = (tileRow + tileColumn) % 2
        const verticalDistance = Math.abs(tileRow - row);
        const horizontalDistance = Math.abs(tileColumn - column);
        const distance = verticalDistance + horizontalDistance;
        return row == tileRow ||
            column == tileColumn ||
            (tileParity === queenParity && verticalDistance > 1 && horizontalDistance > 1) ||
            (distance == 2);
    }
}

const moveComp = ({pieceType, pieceColor, position}: IPiece): pieceComp => {
    const row = getRow(position);
    const column = getColumn(position);
    switch (pieceType) {
        case PieceType.pawn:
            return pawnComp(row,column, pieceColor);
        case PieceType.rook:
            return rookComp(row, column);
        case PieceType.bishop:
            return bishopComp((row + column) % 2);
        case PieceType.knight:
            return knightComp(row, column);
        case PieceType.queen:
            return queenComp(row, column);
        case PieceType.king:
            return () => true;
    }
}

export const moves = (piece: IPiece): number[] => {
    const comp = moveComp(piece);
    let moves = movesByType(piece.pieceType);
    return moves.map(move => move + piece.position)
        .filter(move => move < tileNumber && move >= 0 && comp(move))
        .sort(numberAscSort);
}

type Board = Array<IPiece | null>

export const isKingInDanger = (board: Board, color: PieceColor): boolean => {
    const kingPosition = board.findIndex(p => p?.pieceType === PieceType.king && p.pieceColor === color);
    return board.filter(p => p !== null && p.pieceColor !== color).some(p => canAttack(p!, kingPosition, board));
}

type MoveDirectionPredicate = (currentPosition: number, nextPosition: number) => boolean

const isDiagonalMove: MoveDirectionPredicate = (currentPosition, nextPosition) => getColumn(currentPosition) !== getColumn(nextPosition) && getRow(currentPosition) !== getRow(nextPosition);
const isStraightMove: MoveDirectionPredicate = (currentPosition, nextPosition) => getColumn(currentPosition) === getColumn(nextPosition) || getRow(currentPosition) === getRow(nextPosition);
const isLeftMove: MoveDirectionPredicate = (currentPosition, nextPosition) => getColumn(currentPosition) > getColumn(nextPosition);
const isRightMove: MoveDirectionPredicate = (c, n) => getColumn(c) < getColumn(n);
const isUpMove: MoveDirectionPredicate = (c, n) => getRow(c) > getRow(n);
const isDownMove: MoveDirectionPredicate = (c, n) => getRow(c) < getRow(n);
const isKnightMove: MoveDirectionPredicate = (c, n) => {
    const cRow = getRow(c);
    const cCol = getColumn(c);
    const nRow = getRow(n);
    const nCol = getColumn(n);
    return Math.abs(cRow-nRow) === 2 && Math.abs(cCol - nCol) == 1 || Math.abs(cRow-nRow) === 1 && Math.abs(cCol - nCol) === 2
}

export const getReachablePositionsFilter = (pieceColor: PieceColor, board: Board) => {
    return (moveGroup: number[]) => {
        let newMovesGroup: number[] = [];
        let shouldStop = false;
        moveGroup.forEach(move => {
            if (shouldStop) {
                return
            }
            if (board[move] !== null) {
                shouldStop = true;
            }

            if (board[move]?.pieceColor !== pieceColor) {
                newMovesGroup = [...newMovesGroup, move];
            }
        })
        return newMovesGroup;
    }
}

const getDirectedMoves = (moves: number[], currentPosition: number) => {
    const knightMoves = moves.filter(m => isKnightMove(currentPosition, m)).map(m => [m]);
    const diagonalMoves = moves.filter(m => isDiagonalMove(currentPosition, m));
    const straightMoves = moves.filter(m => isStraightMove(currentPosition, m));
    const lDiagonalMoves = diagonalMoves.filter(m => isLeftMove(currentPosition, m));
    const rDiagonalMoves = diagonalMoves.filter(m => isRightMove(currentPosition, m));
    const lStraightMoves = straightMoves.filter(m => isLeftMove(currentPosition, m)).reverse();
    const rStraightMoves = straightMoves.filter(m => isRightMove(currentPosition, m));
    const uLDiagonalMoves = lDiagonalMoves.filter(m => isUpMove(currentPosition, m)).reverse();
    const dLDiagonalMoves = lDiagonalMoves.filter(m => isDownMove(currentPosition, m));
    const uRDiagonalMoves = rDiagonalMoves.filter(m => isUpMove(currentPosition, m)).reverse();
    const dRDiagonalMoves = rDiagonalMoves.filter(m => isDownMove(currentPosition, m));
    const uStraightMoves = straightMoves.filter(m => isUpMove(currentPosition, m)).reverse();
    const dStraightMoves = straightMoves.filter(m => isDownMove(currentPosition, m));

    return [lStraightMoves, rStraightMoves, uStraightMoves, dStraightMoves,
        uLDiagonalMoves, dLDiagonalMoves, uRDiagonalMoves, dRDiagonalMoves, ...knightMoves]

}

const getDirectedMovesForPiece = (piece: IPiece) => {
    const availableMoves = moves(piece);
    return getDirectedMoves(availableMoves, piece.position);
}

export const getReachablePositions = (piece: IPiece, board: Board) => {
    const {pieceColor, position: piecePosition, pieceType} = piece;
    const reachablePositions = getDirectedMovesForPiece(piece)
        .flatMap(getReachablePositionsFilter(pieceColor, board));
    return reachablePositions
        .filter(p => (pieceType !== PieceType.pawn) ||
            (isDiagonalMove(piecePosition, p) && board[p] !== null) ||
            (!isDiagonalMove(piecePosition, p) && board[p] === null))
}

export const canAttack = (piece: IPiece, position: number, board: Board): boolean => {
    return getReachablePositions(piece, board)
        .filter((p) => piece.pieceType !== PieceType.pawn || isDiagonalMove(p, piece.position))
        .findIndex(p => p === position) !== -1;
}

export const getDefendingPositions = (board: Board, piece: IPiece, reachablePositions?: number[]): number[] => {
    const {pieceColor: color} = piece;
    if (reachablePositions === undefined) {
        reachablePositions = getReachablePositions(piece, board);
    }
    return reachablePositions.filter(newPosition => {
        const possibleBoard = board.map((p, i) => {
            if (i === piece.position) {
                return null
            }
            if (i === newPosition) {
                return {...piece, position: newPosition};
            }
            return p
        });
        return !isKingInDanger(possibleBoard, color)
    });
}

export const getValidMoves = (board: Board, movingPiece: IPiece): number[] => {
    const {pieceColor: color} = movingPiece;
    const isKingAttacked = isKingInDanger(board, color);
    if (movingPiece.pieceType === PieceType.bishop){
        debugger
    }
    const reachablePositions = getReachablePositions(movingPiece, board);
    return getDefendingPositions(board, movingPiece, reachablePositions);
}

type MoveMap = Map<string, number[]>

export const getMovesForColor = (board: Board, player: PieceColor): MoveMap => {
    const pieces = board.filter(p => p?.pieceColor === player) as IPiece[];
    const movesPerPiece: [string, number[]][] = pieces.map(p => [p.id, getValidMoves(board, p)]);

    return new Map(movesPerPiece);
}
