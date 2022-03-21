export interface CalendarEvent<MetaType = any> {
    title: string,
    tipo: string,
    publicado: boolean,
    start: Date;
    end?: Date;
    color?: EventColor;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
}

export interface EventColor {
    primary: string;
}