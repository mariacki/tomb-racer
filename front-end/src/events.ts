export interface Message
{
    type: string;
}

export interface GameDescription
{
    gameId: string,
    gameName: string
}

export interface LoginSucces extends Message
{
    data: {
        userId: string;
        games: GameDescription[];
    }  
}