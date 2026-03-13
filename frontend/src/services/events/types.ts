export interface CreateEventDto {
    name: string;
    startTime: Date;
    endTime: Date;
    status: string;
    window?: number;
}

export interface UpdateEventDto extends Partial<CreateEventDto> { }

export interface IEvent {
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    status: string;
    window: number;
    createdAt: Date;
    updatedAt: Date;
}
