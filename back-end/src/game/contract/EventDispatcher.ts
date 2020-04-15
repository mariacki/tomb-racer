import { Event } from 'tr-common';

export interface EventDispatcher
{
    dispatch(evt: Event): void;
}