import { Event } from '../../../../common/events';

export interface EventDispatcher
{
    dispatch(evt: Event): void;
}