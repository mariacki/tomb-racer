import { IdProvider } from '../../../src/game/contract/IdProvider';

export class IdProviderMock implements IdProvider
{
    ids: Array<string> = ["id1", "id2", "id3"]
    cur: number = 0;
    newId(): string {
        return this.ids[this.cur++];
    }
}