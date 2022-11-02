export default interface IMove {
    moveType: MoveType,
    newPosition: number,
    oldPosition: number,
    additionalMoves?: IMove[]
}

export enum MoveType {
    normal,
    castle,
    promote,
    enPassant
}