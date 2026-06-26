export const ROOMMATES = ['Ariel', 'Aleena', 'Angela', 'Dylan', 'Harry'] as const
export type Roommate = typeof ROOMMATES[number]
