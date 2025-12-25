// Official UK Monopoly property data
// All 28 properties: 22 color properties + 4 stations + 2 utilities

export type PropertyColorGroup =
    | 'brown'
    | 'light-blue'
    | 'pink'
    | 'orange'
    | 'red'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'station'
    | 'utility';

export interface MonopolyPropertyTemplate {
    id: string;
    name: string;
    colorGroup: PropertyColorGroup;
    price: number;
    colorHex: string;
}

// Color hex values for each property group
export const PROPERTY_GROUP_COLORS: Record<PropertyColorGroup, string> = {
    'brown': '#8B4513',
    'light-blue': '#87CEEB',
    'pink': '#FF69B4',
    'orange': '#FFA500',
    'red': '#FF0000',
    'yellow': '#FFD700',
    'green': '#228B22',
    'blue': '#0000CD',
    'station': '#333333',
    'utility': '#808080',
};

export const MONOPOLY_PROPERTIES: MonopolyPropertyTemplate[] = [
    // Brown (2 properties)
    { id: 'old-kent-road', name: 'Old Kent Road', colorGroup: 'brown', price: 60, colorHex: PROPERTY_GROUP_COLORS.brown },
    { id: 'whitechapel-road', name: 'Whitechapel Road', colorGroup: 'brown', price: 60, colorHex: PROPERTY_GROUP_COLORS.brown },

    // Light Blue (3 properties)
    { id: 'angel-islington', name: 'The Angel Islington', colorGroup: 'light-blue', price: 100, colorHex: PROPERTY_GROUP_COLORS['light-blue'] },
    { id: 'euston-road', name: 'Euston Road', colorGroup: 'light-blue', price: 100, colorHex: PROPERTY_GROUP_COLORS['light-blue'] },
    { id: 'pentonville-road', name: 'Pentonville Road', colorGroup: 'light-blue', price: 120, colorHex: PROPERTY_GROUP_COLORS['light-blue'] },

    // Pink (3 properties)
    { id: 'pall-mall', name: 'Pall Mall', colorGroup: 'pink', price: 140, colorHex: PROPERTY_GROUP_COLORS.pink },
    { id: 'whitehall', name: 'Whitehall', colorGroup: 'pink', price: 140, colorHex: PROPERTY_GROUP_COLORS.pink },
    { id: 'northumberland-avenue', name: 'Northumberland Avenue', colorGroup: 'pink', price: 160, colorHex: PROPERTY_GROUP_COLORS.pink },

    // Orange (3 properties)
    { id: 'bow-street', name: 'Bow Street', colorGroup: 'orange', price: 180, colorHex: PROPERTY_GROUP_COLORS.orange },
    { id: 'marlborough-street', name: 'Marlborough Street', colorGroup: 'orange', price: 180, colorHex: PROPERTY_GROUP_COLORS.orange },
    { id: 'vine-street', name: 'Vine Street', colorGroup: 'orange', price: 200, colorHex: PROPERTY_GROUP_COLORS.orange },

    // Red (3 properties)
    { id: 'strand', name: 'Strand', colorGroup: 'red', price: 220, colorHex: PROPERTY_GROUP_COLORS.red },
    { id: 'fleet-street', name: 'Fleet Street', colorGroup: 'red', price: 220, colorHex: PROPERTY_GROUP_COLORS.red },
    { id: 'trafalgar-square', name: 'Trafalgar Square', colorGroup: 'red', price: 240, colorHex: PROPERTY_GROUP_COLORS.red },

    // Yellow (3 properties)
    { id: 'leicester-square', name: 'Leicester Square', colorGroup: 'yellow', price: 260, colorHex: PROPERTY_GROUP_COLORS.yellow },
    { id: 'coventry-street', name: 'Coventry Street', colorGroup: 'yellow', price: 260, colorHex: PROPERTY_GROUP_COLORS.yellow },
    { id: 'piccadilly', name: 'Piccadilly', colorGroup: 'yellow', price: 280, colorHex: PROPERTY_GROUP_COLORS.yellow },

    // Green (3 properties)
    { id: 'regent-street', name: 'Regent Street', colorGroup: 'green', price: 300, colorHex: PROPERTY_GROUP_COLORS.green },
    { id: 'oxford-street', name: 'Oxford Street', colorGroup: 'green', price: 300, colorHex: PROPERTY_GROUP_COLORS.green },
    { id: 'bond-street', name: 'Bond Street', colorGroup: 'green', price: 320, colorHex: PROPERTY_GROUP_COLORS.green },

    // Blue (2 properties)
    { id: 'park-lane', name: 'Park Lane', colorGroup: 'blue', price: 350, colorHex: PROPERTY_GROUP_COLORS.blue },
    { id: 'mayfair', name: 'Mayfair', colorGroup: 'blue', price: 400, colorHex: PROPERTY_GROUP_COLORS.blue },

    // Stations (4 properties)
    { id: 'kings-cross', name: 'Kings Cross Station', colorGroup: 'station', price: 200, colorHex: PROPERTY_GROUP_COLORS.station },
    { id: 'marylebone', name: 'Marylebone Station', colorGroup: 'station', price: 200, colorHex: PROPERTY_GROUP_COLORS.station },
    { id: 'fenchurch-street', name: 'Fenchurch St. Station', colorGroup: 'station', price: 200, colorHex: PROPERTY_GROUP_COLORS.station },
    { id: 'liverpool-street', name: 'Liverpool St. Station', colorGroup: 'station', price: 200, colorHex: PROPERTY_GROUP_COLORS.station },

    // Utilities (2 properties)
    { id: 'electric-company', name: 'Electric Company', colorGroup: 'utility', price: 150, colorHex: PROPERTY_GROUP_COLORS.utility },
    { id: 'water-works', name: 'Water Works', colorGroup: 'utility', price: 150, colorHex: PROPERTY_GROUP_COLORS.utility },
];

// Helper function to get a property by ID
export function getMonopolyProperty(id: string): MonopolyPropertyTemplate | undefined {
    return MONOPOLY_PROPERTIES.find(p => p.id === id);
}

// Helper function to get properties by color group
export function getPropertiesByColorGroup(colorGroup: PropertyColorGroup): MonopolyPropertyTemplate[] {
    return MONOPOLY_PROPERTIES.filter(p => p.colorGroup === colorGroup);
}
