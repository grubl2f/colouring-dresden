/**
 * An enumeration of all categories in the system.
 * The string value is also the category URL slug.
 */
export enum Category {
    Location = 'location',
    LandUse = 'use',
    Type = 'type',
    Age = 'age',
    Size = 'size',
    Construction = 'construction',
    Streetscape = 'streetscape',
    Team = 'team',
    Planning = 'planning',
    Sustainability = 'sustainability',
    Resilience = 'resilience',
    Community = 'community',
}

/**
 * This is the sole configuration variable that defines the order of the categories
 * in the category grid. The order in the enum definition or the other configs does
 * not affect the order of the grid.
 */
export const categoriesOrder: Category[] = [
    Category.Location,
    Category.LandUse,
    Category.Type,
    Category.Size,
    Category.Construction,
    Category.Age,
    Category.Streetscape,
    Category.Team,
    Category.Planning,
    Category.Sustainability,
    Category.Resilience,
    Category.Community,
];

interface CategoryDefinition {
    inactive?: boolean;
    slug: string;
    name: string;
    aboutUrl: string;
    intro: string;
}

export const categoriesConfig: {[key in Category]: CategoryDefinition} = {
    [Category.Age]: {
        slug: 'age',
        name: 'Alter & Geschichte',
        aboutUrl: 'https://pages.colouring.london/age',
        intro: 'Daten zum Gebäudealter können vielfältige Analysen unterstützen und helfen, langfristige Veränderungen vorherzusagen.',
    },
    [Category.Size]: {
        slug: 'size',
        name: 'Größe',
        aboutUrl: 'https://pages.colouring.london/shapeandsize',
        intro: 'Wie groß sind Gebäude? Wie sind sie geformt?',
    },
    [Category.Team]: {
        slug: 'team',
        name: 'Team',
        aboutUrl: 'https://pages.colouring.london/team',
        intro: 'Wer hat die Gebäude erbaut?',
    },
    [Category.Construction]: {
        slug: 'construction',
        name: 'Konstruktion',
        aboutUrl: 'https://pages.colouring.london/construction',
        intro: 'Wie sind die Gebäude gebaut?',
    },
    [Category.Location]: {
        slug: 'location',
        name: 'Standort',
        aboutUrl: 'https://pages.colouring.london/location',
        intro: 'Wo befinden sich die Gebäude? Adresse, Standort und Verweise auf externe Datensätze.',
    },
    [Category.Community]: {
        slug: 'community',
        name: 'Community',
        aboutUrl: 'https://pages.colouring.london/community',
        intro: 'Wie funktionieren Gebäude für die lokale Bevölkerung?',
    },
    [Category.Planning]: {
        slug: 'planning',
        name: 'Planung',
        aboutUrl: 'https://pages.colouring.london/planning',
        intro: 'Planung bezüglich dem Schutz und der Wiedernutzung von Gebäuden.',
    },
    [Category.Sustainability]: {
        slug: 'sustainability',
        name: 'Energie',
        aboutUrl: 'https://pages.colouring.london/sustainability',
        intro: 'Sind Gebäude energieeffizient?',
    },
    [Category.Type]: {
        slug: 'type',
        name: 'Typologie',
        aboutUrl: 'https://pages.colouring.london/buildingtypology',
        intro: 'Wie lassen sich Gebäude Typologien zuordnen?',
    },
    [Category.LandUse]: {
        slug: 'use',
        name: 'Nutzung',
        aboutUrl: 'https://pages.colouring.london/use',
        intro: 'Wie werden Gebäude genutzt? Wie änderte sich dies über die Zeit?',
    },
    [Category.Streetscape]: {
        inactive: true,
        slug: 'streetscape',
        name: 'Straßenraum',
        aboutUrl: 'https://pages.colouring.london/greenery',
        intro: "Wie sieht die Umgebung von Gebäuden bezüglich des Straßenraums aus? Coming soon…",
    },
    [Category.Resilience]: {
        slug: 'resilience',
        name: 'Resilienz',
        aboutUrl: 'https://pages.colouring.london/dynamics',
        intro: 'Wie gut sind Gebäude auf Extremwetterereignisse angepasst?'
    },
};
