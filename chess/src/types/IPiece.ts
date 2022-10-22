export default interface IPiece {
    id: string,
    pieceType: PieceType,
    pieceColor: PieceColor,
    position: number
}

export enum PieceType {
    king = 'k',
    rook = 'r',
    queen = 'q',
    bishop = 'b',
    knight = 'n',
    pawn = 'p'
}

export enum PieceColor {
    black = 'd',
    white = 'l'
}