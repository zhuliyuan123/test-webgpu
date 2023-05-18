export interface RGB {
    r: number;
    g: number;
    b: number;
}
export interface RGBA extends RGB {
    a: number;
}

export const RED_RGBA: RGBA = {
    r: 1,
    g: 0,
    b: 0,
    a: 1,
}